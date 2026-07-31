/**
 * ClientSideImageCompressor
 * A high-performance, accessible, and portable JavaScript class for downsampling
 * and compressing images on the client side before triggering server uploads.
 */
class ClientSideImageCompressor {
  /**
   * @param {Object} options Configuration parameters
   * @param {number} [options.maxWidth=1200] The maximum width of the output image in pixels
   * @param {number} [options.maxHeight=1200] The maximum height of the output image in pixels
   * @param {number} [options.quality=0.82] Floating-point value between 0.1 and 1.0 (JPEG/WebP)
   * @param {string} [options.mimeType='image/webp'] The target export format
   * @param {boolean} [options.keepAspectRatio=true] Preserve original aspect ratio during scaling
   * @param {boolean} [options.useOffscreenCanvas=true] Attempt to utilize OffscreenCanvas if supported
   */
  constructor(options = {}) {
    this.maxWidth = options.maxWidth || 1200;
    this.maxHeight = options.maxHeight || 1200;
    this.quality = options.quality !== undefined ? options.quality : 0.82;
    this.mimeType = options.mimeType || 'image/webp';
    this.keepAspectRatio = options.keepAspectRatio !== undefined ? options.keepAspectRatio : true;
    this.useOffscreenCanvas = options.useOffscreenCanvas !== undefined ? options.useOffscreenCanvas : true;
  }

  /**
   * Processes a user-selected File object and returns compressed data
   * @param {File} file The raw input file from file picker or drag-and-drop
   * @returns {Promise<{blob: Blob, originalSize: number, compressedSize: number, originalResolution: string, compressedResolution: string, duration: number}>}
   */
  async compress(file) {
    const startTime = performance.now();

    if (!file || !(file instanceof File)) {
      throw new Error('Invalid input: A valid File object is required.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error(`Invalid format: File type '${file.type}' is not a supported raster image.`);
    }

    // Do not apply lossy compression on SVG, PDF, or GIF files
    if (file.type === 'image/gif' || file.type.includes('svg') || file.type.includes('pdf')) {
      throw new Error(`Unsupported format: Compression is not supported for ${file.type}.`);
    }

    // Attempt OffscreenCanvas if supported & requested
    if (this.useOffscreenCanvas && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined') {
      try {
        return await this._compressWithWorkerOrOffscreen(file, startTime);
      } catch (err) {
        console.warn('OffscreenCanvas processing failed, falling back to standard canvas:', err);
      }
    }

    // Fall back to standard DOM Canvas
    return await this._compressWithStandardCanvas(file, startTime);
  }

  /**
   * Main scaling calculation helper
   * @private
   */
  _calculateDimensions(width, height) {
    let targetWidth = width;
    let targetHeight = height;

    if (this.keepAspectRatio) {
      if (width > this.maxWidth || height > this.maxHeight) {
        const ratio = width / height;
        if (ratio > 1) {
          targetWidth = this.maxWidth;
          targetHeight = Math.round(this.maxWidth / ratio);
        } else {
          targetHeight = this.maxHeight;
          targetWidth = Math.round(this.maxHeight * ratio);
        }
      }
    } else {
      targetWidth = Math.min(width, this.maxWidth);
      targetHeight = Math.min(height, this.maxHeight);
    }

    // Safety limit to avoid iOS Safari Canvas memory allocation thresholds (max 4096px)
    const CANVAS_MAX_CEILING = 4096;
    if (targetWidth > CANVAS_MAX_CEILING || targetHeight > CANVAS_MAX_CEILING) {
      const reductionRatio = Math.max(targetWidth / CANVAS_MAX_CEILING, targetHeight / CANVAS_MAX_CEILING);
      targetWidth = Math.round(targetWidth / reductionRatio);
      targetHeight = Math.round(targetHeight / reductionRatio);
    }

    return { width: targetWidth, height: targetHeight };
  }

  /**
   * Performance-optimized compression using modern OffscreenCanvas
   * @private
   */
  async _compressWithWorkerOrOffscreen(file, startTime) {
    const imageBitmap = await createImageBitmap(file);
    const originalWidth = imageBitmap.width;
    const originalHeight = imageBitmap.height;

    const { width: targetWidth, height: targetHeight } = this._calculateDimensions(originalWidth, originalHeight);

    const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = offscreen.getContext('2d');

    if (!ctx) {
      imageBitmap.close();
      throw new Error('Could not retrieve 2D context from OffscreenCanvas.');
    }

    // Multi-pass step-down downsampling for high-quality antialiasing
    if (originalWidth / targetWidth >= 2) {
      const intermediateWidth = Math.round(originalWidth / 2);
      const intermediateHeight = Math.round(originalHeight / 2);
      const intermediateCanvas = new OffscreenCanvas(intermediateWidth, intermediateHeight);
      const intermediateCtx = intermediateCanvas.getContext('2d');

      if (intermediateCtx) {
        intermediateCtx.drawImage(imageBitmap, 0, 0, intermediateWidth, intermediateHeight);
        ctx.drawImage(intermediateCanvas, 0, 0, targetWidth, targetHeight);
      } else {
        ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
      }
    } else {
      ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    }

    imageBitmap.close();

    const blob = await offscreen.convertToBlob({
      type: this.mimeType,
      quality: this.mimeType === 'image/png' ? undefined : this.quality
    });

    const duration = Math.round(performance.now() - startTime);

    return {
      blob,
      originalSize: file.size,
      compressedSize: blob.size,
      originalResolution: `${originalWidth}px x ${originalHeight}px`,
      compressedResolution: `${targetWidth}px x ${targetHeight}px`,
      duration
    };
  }

  /**
   * Standard client-side HTML5 Canvas fallback pipeline
   * @private
   */
  _compressWithStandardCanvas(file, startTime) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const originalWidth = img.naturalWidth;
          const originalHeight = img.naturalHeight;

          const { width: targetWidth, height: targetHeight } = this._calculateDimensions(originalWidth, originalHeight);

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Could not retrieve 2D context from standard HTML5 canvas.'));
            return;
          }

          // Step-down pass to avoid aliased jagged edges
          if (originalWidth / targetWidth >= 2) {
            const stepCanvas = document.createElement('canvas');
            stepCanvas.width = originalWidth / 2;
            stepCanvas.height = originalHeight / 2;
            const stepCtx = stepCanvas.getContext('2d');
            if (stepCtx) {
              stepCtx.drawImage(img, 0, 0, stepCanvas.width, stepCanvas.height);
              ctx.drawImage(stepCanvas, 0, 0, targetWidth, targetHeight);
            } else {
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            }
          } else {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas toBlob extraction failed.'));
                return;
              }

              const duration = Math.round(performance.now() - startTime);

              resolve({
                blob,
                originalSize: file.size,
                compressedSize: blob.size,
                originalResolution: `${originalWidth}px x ${originalHeight}px`,
                compressedResolution: `${targetWidth}px x ${targetHeight}px`,
                duration
              });
            },
            this.mimeType,
            this.mimeType === 'image/png' ? undefined : this.quality
          );
        };

        img.onerror = () => {
          reject(new Error('Could not load the parsed source file as an Image object.'));
        };
      };

      reader.onerror = () => {
        reject(new Error('FileReader failed to read the source file.'));
      };

      reader.readAsDataURL(file);
    });
  }
}

// Export for ES modules or global window binding
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClientSideImageCompressor;
} else if (typeof define === 'function' && define.amd) {
  define(() => ClientSideImageCompressor);
} else {
  window.ClientSideImageCompressor = ClientSideImageCompressor;
}
