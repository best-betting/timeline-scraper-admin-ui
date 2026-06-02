export type ScrapperAdminRuntimeConfig = {
  /** Same-origin path; Node proxies to SCRAPPER_UPSTREAM. */
  apiBaseUrl: string;
  appBasePath: string;
  proxyMode: true;
};

declare global {
  interface Window {
    __SCRAPPER_ADMIN_CONFIG__?: ScrapperAdminRuntimeConfig;
  }
}

export function getRuntimeConfig(): ScrapperAdminRuntimeConfig | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.__SCRAPPER_ADMIN_CONFIG__;
}

export function hasRuntimeApiBase(): boolean {
  return Boolean(getRuntimeConfig()?.proxyMode);
}
