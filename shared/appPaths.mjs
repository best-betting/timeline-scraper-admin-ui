/** @param {string | undefined | null} path */
export function normalizeBasePath(path) {
  const raw = String(path ?? '').trim();
  if (!raw || raw === '/') return '';
  let p = raw.replace(/\/+$/, '');
  if (!p.startsWith('/')) p = `/${p}`;
  return p;
}

/** Vite `base` option (trailing slash). */
export function viteBase(path) {
  const p = normalizeBasePath(path);
  return p ? `${p}/` : '/';
}

/**
 * Browser → UI server mount for scrapper API.
 * Example: /sports-data-admin/api/admin/v1/stats
 */
export function uiApiMount(basePath) {
  const base = normalizeBasePath(basePath);
  return base ? `${base}/api` : '/api';
}

/** Prefixes accepted by the UI server (full path + ingress-stripped base). */
export function uiApiMountPrefixes(basePath) {
  const full = uiApiMount(basePath);
  const prefixes = [full];
  if (basePath) prefixes.push('/api');
  return prefixes;
}

/** @returns {string | null} matched mount prefix */
export function matchUiApiRoute(pathname, basePath) {
  for (const prefix of uiApiMountPrefixes(basePath)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return prefix;
    }
  }
  return null;
}

/** @deprecated use uiApiMount */
export function scrapperApiPrefix(basePath) {
  return uiApiMount(basePath);
}
