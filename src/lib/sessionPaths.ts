export function sessionApiPath(appId: string, matchKey: string) {
  return `/admin/v1/sessions/${encodeURIComponent(appId)}/${encodeURIComponent(matchKey)}`;
}

export function sessionDetailHref(appId: string, matchKey: string) {
  return `detail?appId=${encodeURIComponent(appId)}&matchKey=${encodeURIComponent(matchKey)}`;
}

export function fixtureEditHref(appId: string, matchKey: string) {
  return `../fixtures/edit?appId=${encodeURIComponent(appId)}&matchKey=${encodeURIComponent(matchKey)}&source=session`;
}
