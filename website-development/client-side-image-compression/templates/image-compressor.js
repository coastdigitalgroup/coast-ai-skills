/**
 * Reusable Client-Side Image Compressor Utility
 *
 * Provides a high-performance, async, promise-based API for resizing and compressing
 * images in the browser before triggering network uploads. Uses HTML5 Canvas context
 * and handles transparency safety checks.
 *
 * @example
 * const compressor = new ImageCompressor({
 *   maxWidth: 1200,
 *   maxHeight: 1200,
 *   quality: 0.8,
 *   mimeType: 'image/webp'
 * });
 *
 * const fileInput = document.getElementById('input');
 * fileInput.addEventListener('change', async (e) => {
 *   const file = e.target.files[0];
 *   try {
 *     const { blob, url, metadata } = await compressor.compress(file);
 *     console.log(`Saved ${metadata.savingsPercent}%!`);
 *     document.getElementById('preview').src = url;
 *     // Append blob to FormData and upload
 *   } catch (err) {
 *     console.error('Compression failed:', err);
 *   }
 * });
 */
export class ImageCompressor {
  /**
   * @param {Object} options Configuration parameters.
   * @param {number} [options.maxWidth=1920] Bound limit for output image width.
   * @param {number} [options.maxHeight=1080] Bound limit for output image height.
   * @param {number} [options.quality=0.82] Output quality parameter between 0.0 and 1.0.
   * @param {string} [options.mimeType='image/jpeg'] Mime-type format output ('image/jpeg', 'image/webp', 'image/png').
   * @param {string} [options.fallbackBackgroundColor='#ffffff'] Background color color-fill when converting transparent PNGs to lossy formats.
   */
  constructor(options = {}) {
    this.maxWidth = options.maxWidth || 1920;
    this.maxHeight = options.maxHeight || 1080;
    this.quality = options.quality !== undefined ? options.quality : 0.82;
    this.mimeType = options.mimeType || 'image/jpeg';
    this.fallbackBackgroundColor = options.fallbackBackgroundColor || '#ffffff';

    // Track active object URLs for automatic disposal
    this.activeUrls = new Set();
  }

  /**
   * Orchestrates the compression workflow of a single file object.
   *
   * @param {File|Blob} file The input file or raw blob to compress.
   * @returns {Promise<{blob: Blob, url: string, metadata: Object}>} The compressed file bundle.
   */
  async compress(file) {
    if (!file || !(file instanceof Blob)) {
      throw new Error('Invalid input: compressor requires a File or Blob object.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error(`Unsupported mime-type: ${file.type} is not an image.`);
    }

    const objectUrl = URL.createObjectURL(file);
    this.activeUrls.add(objectUrl);

    try {
      // 1. Load image into memory
      const img = await this._loadImage(objectUrl);

      // 2. Calculate ideal proportional dimensions
      const { width, height } = this._calculateDimensions(img.naturalWidth, img.naturalHeight);

      // 3. Create offscreen drawing surface
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not instantiate HTML5 2D Canvas context.');
      }

      // 4. Paint background to handle transparency fill during JPEG conversion
      if (this.mimeType === 'image/jpeg' && this._hasTransparency(file.type)) {
        ctx.fillStyle = this.fallbackBackgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // 5. Draw image onto scaled target canvas bounds
      ctx.drawImage(img, 0, 0, width, height);

      // 6. Asynchronous extraction of compressed blob binary
      const compressedBlob = await this._extractBlob(canvas);

      // 7. Create safe URL for immediate frontend usage
      const compressedUrl = URL.createObjectURL(compressedBlob);
      this.activeUrls.add(compressedUrl);

      // Clean up original source object URL
      URL.revokeObjectURL(objectUrl);
      this.activeUrls.delete(objectUrl);

      // Calculate efficiency statistics
      const sizeDifference = file.size - compressedBlob.size;
      const savingsPercent = file.size > 0 ? Math.round((sizeDifference / file.size) * 100) : 0;

      return {
        blob: compressedBlob,
        url: compressedUrl,
        metadata: {
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          originalSize: file.size,
          compressedWidth: width,
          compressedHeight: height,
          compressedSize: compressedBlob.size,
          savingsPercent: savingsPercent > 0 ? savingsPercent : 0,
          format: this.mimeType
        }
      };

    } catch (error) {
      // Ensure cleanup of original URL in case of runtime exception
      URL.revokeObjectURL(objectUrl);
      this.activeUrls.delete(objectUrl);
      throw error;
    }
  }

  /**
   * Helper method to convert Object URL into an Image component
   */
  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Browser failed to parse and render image source.'));
      img.src = url;
    });
  }

  /**
   * Calculates scaling boundaries while maintaining the proportional aspect ratio.
   */
  _calculateDimensions(width, height) {
    if (width <= this.maxWidth && height <= this.maxHeight) {
      return { width, height }; // No scaling needed, below bounds
    }

    const ratio = Math.min(this.maxWidth / width, this.maxHeight / height);
    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio)
    };
  }

  /**
   * Checks whether the file format natively supports alpha transparency.
   */
  _hasTransparency(mimeType) {
    return mimeType === 'image/png' || mimeType === 'image/gif' || mimeType === 'image/svg+xml';
  }

  /**
   * Promise wrapper around Native canvas.toBlob callback.
   */
  _extractBlob(canvas) {
    return new Promise((resolve, reject) => {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas compilation to blob returned null.'));
            }
          },
          this.mimeType,
          this.quality
        );
      } else {
        reject(new Error('The running browser context lacks canvas.toBlob support.'));
      }
    });
  }

  /**
   * Clean up all object URLs created by this utility instance to prevent memory leaks.
   * Call this when disposing of the current page, component, or upload view.
   */
  dispose() {
    for (const url of this.activeUrls) {
      URL.revokeObjectURL(url);
    }
    this.activeUrls.clear();
  }
}
