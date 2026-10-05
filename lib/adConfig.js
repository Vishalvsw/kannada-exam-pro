// src/lib/adConfig.js
export const AD_CONFIG = {
  masterSwitch: true,

  adsterra: {
    enabled: true,

    top: {
      key: 'a2ad75aded5a9dd54c993b9731bd9df9',
      width: 320,
      height: 50,
    },
    bottom: {
      key: 'ff70388742670dbabb2b9342020cea75',
      width: 320,      // ← changed from 468
      height: 50,      // ← changed from 60
    },

    showOn: ['/quiz'],
    hideOn: ['/', '/login', '/profile'],
  },

  gpt: {
    enabled: true,
    showOn: ['/quiz'],
    hideOn: ['/'],
  },

  debug: true,
};

export function shouldShowAds(network, pathname) {
  if (!AD_CONFIG.masterSwitch) {
    if (AD_CONFIG.debug) console.log('[Ads] Master OFF — no ads');
    return false;
  }

  const cfg = AD_CONFIG[network];
  if (!cfg || !cfg.enabled) {
    if (AD_CONFIG.debug) console.log(`[Ads] ${network} disabled`);
    return false;
  }

  if (cfg.hideOn?.some((p) => matchesPath(p, pathname))) {
    if (AD_CONFIG.debug) console.log(`[Ads] ${network} hidden on ${pathname}`);
    return false;
  }

  const show = cfg.showOn?.some((p) => matchesPath(p, pathname));

  if (AD_CONFIG.debug) {
    console.log(`[Ads] ${network} on ${pathname}: ${show ? '✅ SHOW' : '❌ SKIP'}`);
  }

  return show;
}

function matchesPath(pattern, pathname) {
  if (pattern === '*') return true;
  if (pattern.endsWith('/*')) return pathname.startsWith(pattern.slice(0, -2));
  return pathname === pattern;
}