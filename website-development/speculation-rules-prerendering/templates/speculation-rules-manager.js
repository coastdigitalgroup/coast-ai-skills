/**
 * Speculation Rules Manager & Lifecycle Controller
 * Provides dynamic rule injection, network/battery constraint checks,
 * and deferred execution guards for prerendered pages.
 */
export class SpeculationRulesManager {
  /**
   * @param {Object} options
   * @param {boolean} [options.enablePrerender=true] Allow full page prerendering
   * @param {boolean} [options.respectDataSaver=true] Disable rules if Data Saver is ON
   * @param {Array<string>} [options.allowedConnections=['4g', '3g']] Allowed effective connection types
   */
  constructor(options = {}) {
    this.options = {
      enablePrerender: true,
      respectDataSaver: true,
      allowedConnections: ['4g', '3g'],
      ...options
    };

    this.activeRuleScript = null;
  }

  /**
   * Checks if Speculation Rules API is supported by the user agent.
   * @returns {boolean}
   */
  static isSupported() {
    return Boolean(
      typeof HTMLScriptElement !== 'undefined' &&
      HTMLScriptElement.supports &&
      HTMLScriptElement.supports('speculationrules')
    );
  }

  /**
   * Evaluates network connection metrics to decide if speculative downloading is safe.
   * @returns {boolean}
   */
  shouldAllowSpeculation() {
    if (!navigator.connection) return true;

    const { saveData, effectiveType } = navigator.connection;

    if (this.options.respectDataSaver && saveData) {
      console.warn('[SpeculationRules] Skipping: Data Saver is enabled by user.');
      return false;
    }

    if (effectiveType && !this.options.allowedConnections.includes(effectiveType)) {
      console.warn(`[SpeculationRules] Skipping: Poor connection type (${effectiveType}).`);
      return false;
    }

    return true;
  }

  /**
   * Dynamically updates or injects inline speculation rules into the document head.
   * @param {Object} rules - Standard Speculation Rules JSON structure
   */
  applyRules(rules) {
    if (!SpeculationRulesManager.isSupported()) {
      console.warn('[SpeculationRules] API not supported. Falling back to default browser navigation.');
      return false;
    }

    if (!this.shouldAllowSpeculation()) {
      return false;
    }

    // Downgrade prerender to prefetch if prerender is disabled in options
    const finalRules = { ...rules };
    if (!this.options.enablePrerender && finalRules.prerender) {
      finalRules.prefetch = [
        ...(finalRules.prefetch || []),
        ...finalRules.prerender
      ];
      delete finalRules.prerender;
    }

    // Remove existing dynamic rule script if present
    if (this.activeRuleScript) {
      this.activeRuleScript.remove();
    }

    // Inject new script tag with type="speculationrules"
    const script = document.createElement('script');
    script.type = 'speculationrules';
    script.textContent = JSON.stringify(finalRules);
    document.head.appendChild(script);

    this.activeRuleScript = script;
    return true;
  }

  /**
   * Helper utility for destination pages to execute side-effectful functions
   * (analytics, WebSocket, video autoplay) only after the page is activated by the user.
   * @param {Function} callback - Function to run on active foreground state
   */
  static whenActivated(callback) {
    if (typeof document === 'undefined') return;

    if (document.prerendering) {
      console.log('[SpeculationRules] Page is prerendering in background. Holding callback...');
      document.addEventListener('prerenderchange', () => {
        console.log('[SpeculationRules] Page activated! Executing held callback.');
        callback();
      }, { once: true });
    } else {
      callback();
    }
  }
}
