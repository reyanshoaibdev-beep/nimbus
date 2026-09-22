// =============================================================================
// Central ad configuration — every ad tag for the site lives here.
// Paste your real values in place of the REPLACE_* placeholders below.
//
// The banner "key" is the value shown as ******** in your ad dashboard's
// `atOptions.key`. It is the same string used in the invoke.js URL path:
//   https://www.highrevenueformat.com/<KEY>/invoke.js
// Banner keys are NOT secret (they are visible in the delivered page), so it is
// fine to keep them here in the client bundle.
// =============================================================================

export type BannerSize = '160x300' | '160x600' | '320x50' | '728x90'

export interface BannerAd {
  key: string
  width: number
  height: number
}

/** highrevenueformat.com iframe banners, keyed by their pixel size. */
export const BANNER_ADS: Record<BannerSize, BannerAd> = {
  '160x300': { key: 'REPLACE_KEY_160x300', width: 160, height: 300 },
  '160x600': { key: 'REPLACE_KEY_160x600', width: 160, height: 600 },
  '320x50': { key: 'REPLACE_KEY_320x50', width: 320, height: 50 },
  '728x90': { key: 'REPLACE_KEY_728x90', width: 728, height: 90 },
}

/** Host for the iframe banner invoke script (protocol-relative). */
export const BANNER_INVOKE_HOST = '//www.highrevenueformat.com'

/** profitableratecpmnetwork.com native banner (async). */
export const NATIVE_BANNER = {
  src: 'https://pl31466872.profitableratecpmnetwork.com/7632f91d07fa56a04557757ac890907f/invoke.js',
  containerId: 'container-7632f91d07fa56a04557757ac890907f',
}

/** Popunder (loads once per session, site-wide). */
export const POPUNDER = {
  src: 'https://pl31466871.profitableratecpmnetwork.com/3e/d4/2a/3ed42a7f0b4e8169adf63a02820d2ed6.js',
}

/** Floating social bar (site-wide). */
export const SOCIAL_BAR = {
  src: 'https://pl31466874.profitableratecpmnetwork.com/8e/97/a5/8e97a56b6ae7bd4ef2d62f1d47e43121.js',
}

/** Direct/Smart link — use as an href where a monetized link is needed. */
export const SMART_LINK = {
  url: 'https://www.profitableratecpmnetwork.com/xcxuizbtm?key=REPLACE_SMARTLINK_KEY',
}

/** True when a banner still holds its placeholder key and should not render. */
export function isPlaceholder(key: string): boolean {
  return !key || key.startsWith('REPLACE_')
}

/** Builds the isolated iframe document for a single banner ad. */
export function buildBannerSrcDoc(ad: BannerAd): string {
  return [
    '<!doctype html><html><head><meta charset="utf-8">',
    '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>',
    '</head><body>',
    '<script type="text/javascript">',
    `atOptions = { 'key':'${ad.key}', 'format':'iframe', 'height':${ad.height}, 'width':${ad.width}, 'params':{} };`,
    '<\/script>',
    `<script type="text/javascript" src="${BANNER_INVOKE_HOST}/${ad.key}/invoke.js"><\/script>`,
    '</body></html>',
  ].join('')
}
