export function subscribeToHash(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function normalizeHash(hash) {
  return (hash.replace(/^#/, '').split('?')[0] || '/').replace(/\/$/, '') || '/'
}

export function getHashPath() {
  return normalizeHash(window.location.hash)
}
