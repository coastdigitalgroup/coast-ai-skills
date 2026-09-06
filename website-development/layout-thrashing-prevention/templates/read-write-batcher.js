/**
 * FastDOM-style Read/Write Batcher for Layout Thrashing Prevention
 *
 * Enforces frame-aligned decoupling of DOM geometric queries (reads)
 * and DOM mutations (writes) to eliminate forced synchronous reflows.
 */

class DOMBatcher {
  constructor() {
    this.readTasks = [];
    this.writeTasks = [];
    this.scheduled = false;

    this.run = this.run.bind(this);
  }

  /**
   * Schedule a read task (layout query / measurement).
   * @param {Function} task - Function executing DOM reads.
   */
  read(task) {
    this.readTasks.push(task);
    this.schedule();
    return task;
  }

  /**
   * Schedule a write task (DOM/style mutation).
   * @param {Function} task - Function executing DOM writes.
   */
  write(task) {
    this.writeTasks.push(task);
    this.schedule();
    return task;
  }

  /**
   * Remove a scheduled task before execution.
   */
  clear(task) {
    return this.remove(this.readTasks, task) || this.remove(this.writeTasks, task);
  }

  remove(array, task) {
    const index = array.indexOf(task);
    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }
    return false;
  }

  schedule() {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(this.run);
    }
  }

  run() {
    const reads = this.readTasks.slice(0);
    const writes = this.writeTasks.slice(0);

    this.readTasks.length = 0;
    this.writeTasks.length = 0;
    this.scheduled = false;

    // Execute all reads first
    for (let i = 0; i < reads.length; i++) {
      try {
        reads[i]();
      } catch (err) {
        console.error('[DOMBatcher] Error in read phase:', err);
      }
    }

    // Execute all writes together in the same frame preparation
    for (let i = 0; i < writes.length; i++) {
      try {
        writes[i]();
      } catch (err) {
        console.error('[DOMBatcher] Error in write phase:', err);
      }
    }
  }
}

// Singleton export
export const domBatcher = new DOMBatcher();

/**
 * Example Usage:
 *
 * import { domBatcher } from './read-write-batcher.js';
 *
 * // Multi-element update across decoupled components
 * domBatcher.read(() => {
 *   const height = cardElement.offsetHeight;
 *
 *   domBatcher.write(() => {
 *     cardElement.style.height = `${height + 10}px`;
 *   });
 * });
 */
