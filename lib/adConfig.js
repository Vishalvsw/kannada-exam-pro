// src/lib/adConfig.js
/**
 * 🎯 GLOBAL AD CONFIGURATION
 *
 * Change these settings to control ads across the entire site.
 * No component edits required — just update this file.
 */

export const AD_CONFIG = {
  // ============================================================
  // 🌍 GLOBAL SWITCH — turn ALL ads on/off
  // ============================================================
  masterSwitch: true, // true = ads run | false = no ads anywhere

  // ============================================================
  // 📢 ADSTERRA — two zones on the same page with different keys
  // ============================================================
  adsterra: {
    enabled: true,

    // Top slot (fills well)
    top: {
      key: 'a2ad75aded5a9dd54c993b9731bd9df9',
      width: 320,
      height: 50,
    },

    // Bottom slot (new size — same as top for better fill rate)
    bottom: {
      key: 'ff70388742670dbabb2b9342020cea75',
      width: 320,
      height: 50,
    },

    // Routes where Adsterra should appear
    showOn: ['/quiz'],

    // Routes to NEVER show on (overrides showOn)
    hideOn: ['/', '/login', '/profile'],
  },

  // ============================================================
  // 📢 GOOGLE AD MANAGER / GPT
  // ============================================================
  gpt: {
    enabled: true,
    showOn: ['/quiz'],
    hideOn: ['/'],
  },

  // ============================================================
  // 🐛 DEBUG
  // ============================================================
  debug: true, // logs each decision to console
};

/**
 * Check if ads should show on a given path for a network
 * @param {'adsterra' | 'gpt'} network
 * @param {string} pathname — e.g., '/quiz'
 * @returns {boolean}
 */
export function shouldShowAds(network, pathname) {
  // Master kill switch
  if (!AD_CONFIG.masterSwitch) {
    if (AD_CONFIG.debug) console.log(`[Ads] Master OFF — no ads`);
    return false;
  }

  const cfg = AD_CONFIG[network];
  if (!cfg || !cfg.enabled) {
    if (AD_CONFIG.debug) console.log(`[Ads] ${network} disabled`);
    return false;
  }

  // Hide rules take priority
  if (cfg.hideOn?.some((p) => matchesPath(p, pathname))) {
    if (AD_CONFIG.debug) console.log(`[Ads] ${network} hidden on ${pathname}`);
    return false;
  }

  // Show rules
  const show = cfg.showOn?.some((p) => matchesPath(p, pathname));

  if (AD_CONFIG.debug) {
    console.log(`[Ads] ${network} on ${pathname}: ${show ? '✅ SHOW' : '❌ SKIP'}`);
  }

  return show;
}

/**
 * Path matcher: exact, prefix with /*, or '*' for all
 */
function matchesPath(pattern, pathname) {
  if (pattern === '*') return true;
  if (pattern.endsWith('/*')) {
    return pathname.startsWith(pattern.slice(0, -2));
  }
  return pathname === pattern;
}