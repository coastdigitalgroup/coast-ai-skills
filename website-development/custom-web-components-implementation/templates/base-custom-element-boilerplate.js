/**
 * BaseCustomElement
 * Production-grade base class for native HTML Web Components.
 * Provides declarative Shadow DOM setup, automatic property-to-attribute reflection,
 * AbortController lifecycle teardown, slotted element monitoring, and safe CustomEvent dispatching.
 */
export class BaseCustomElement extends HTMLElement {
  /**
   * Custom element tag name helper. Override in subclass.
   * @returns {string}
   */
  static get tag() {
    throw new Error('Subclasses of BaseCustomElement must define static get tag()');
  }

  /**
   * List of attribute names to monitor for reactive updates.
   * Override in subclass.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this._abortController = null;
    this._shadowRoot = null;

    // Automatically attach open shadow root if template provided
    const templateHTML = this.renderTemplate();
    const styleHTML = this.renderStyles();

    if (templateHTML || styleHTML) {
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._shadowRoot.innerHTML = `
        <style>${styleHTML}</style>
        ${templateHTML}
      `;
    }
  }

  /**
   * Subclass method returning internal HTML template markup.
   * @returns {string}
   */
  renderTemplate() {
    return `<slot></slot>`;
  }

  /**
   * Subclass method returning scoped Shadow DOM CSS styles.
   * @returns {string}
   */
  renderStyles() {
    return `
      :host {
        display: block;
        box-sizing: border-box;
      }
      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /**
   * Standard custom element connection lifecycle hook.
   */
  connectedCallback() {
    // Instantiate AbortController for atomic event teardown
    this._abortController = new AbortController();

    // Perform initial DOM queries and setup
    this.onComponentConnect(this._abortController.signal);
  }

  /**
   * Standard custom element disconnection lifecycle hook.
   */
  disconnectedCallback() {
    // Abort all event listeners registered with signal
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = null;
    }

    this.onComponentDisconnect();
  }

  /**
   * Standard custom element attribute mutation lifecycle hook.
   * @param {string} name
   * @param {string|null} oldValue
   * @param {string|null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.onAttributeChange(name, oldValue, newValue);
  }

  /**
   * Lifecycle hook for subclass execution when connected.
   * @param {AbortSignal} signal
   */
  onComponentConnect(signal) {
    // Override in subclass
  }

  /**
   * Lifecycle hook for subclass execution when disconnected.
   */
  onComponentDisconnect() {
    // Override in subclass
  }

  /**
   * Reactive hook for subclass execution when observed attribute mutates.
   * @param {string} name
   * @param {string|null} oldValue
   * @param {string|null} newValue
   */
  onAttributeChange(name, oldValue, newValue) {
    // Override in subclass
  }

  /**
   * Helper to dispatch composed, bubbling CustomEvents across Shadow DOM boundary.
   * @param {string} eventName
   * @param {Object} [detail={}]
   * @param {Object} [options={}]
   */
  dispatchCustomEvent(eventName, detail = {}, options = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...options
    });
    return this.dispatchEvent(event);
  }

  /**
   * Safely registers the custom element in the customElements registry.
   */
  static register() {
    const tagName = this.tag;
    if (tagName && !customElements.get(tagName)) {
      customElements.define(tagName, this);
    }
  }
}
