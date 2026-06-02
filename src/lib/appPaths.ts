import { getRuntimeConfig } from './runtimeConfig';

export function normalizeBasePath(path: string | undefined | null): string {
  const raw = (path ?? '').trim();
  if (!raw || raw === '/') return '';
  let p = raw.replace(/\/+$/, '');
  if (!p.startsWith('/')) p = `/${p}`;
  return p;
}

export const appBasePath = normalizeBasePath(
  typeof import.meta !== 'undefined' ? import.meta.env.VITE_APP_BASE_PATH : ''
);

export const routerBasename = appBasePath || undefined;

export function stripAppBasePath(pathname: string): string {
  if (!appBasePath) return pathname;
  if (pathname === appBasePath) return '/';
  if (pathname.startsWith(`${appBasePath}/`)) {
    return pathname.slice(appBasePath.length) || '/';
  }
  return pathname;
}

function uiApiMountLocal(): string {
  return appBasePath ? `${appBasePath}/api` : '/api';
}

/** UI server API mount; paths like /admin/v1/stats are appended by the client. */
export function defaultScrapperApiBase(): string {
  const runtime = getRuntimeConfig();
  if (runtime?.apiBaseUrl) return runtime.apiBaseUrl;

  if (import.meta.env.DEV) {
    const override = import.meta.env.VITE_SCRAPPER_API_BASE_URL?.trim();
    if (override) {
      if (appBasePath && !override.startsWith(appBasePath)) {
        return uiApiMountLocal();
      }
      return override;
    }
  }

  return uiApiMountLocal();
}
