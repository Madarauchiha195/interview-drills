// api/utils/cache.js
const store = new Map();

export function setCache(key, value, ttlSec = 60) {
  const expiresAt = Date.now() + ttlSec * 1000;
  store.set(key, { value, expiresAt });
}

export function getCache(key) {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    store.delete(key);
    return null;
  }
  return e.value;
}
