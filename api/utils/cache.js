// api/utils/cache.js
const store = new Map();

// Cache statistics
const stats = {
  hits: 0,
  misses: 0,
  sets: 0
};

export function setCache(key, value, ttlSec = 60) {
  const expiresAt = Date.now() + ttlSec * 1000;
  store.set(key, { value, expiresAt });
  stats.sets++;
  console.log(`[CACHE] Set: ${key}, TTL: ${ttlSec}s, Total Sets: ${stats.sets}`);
}

export function getCache(key) {
  const e = store.get(key);
  if (!e) {
    stats.misses++;
    console.log(`[CACHE] Miss: ${key}, Total Misses: ${stats.misses}`);
    return null;
  }
  if (Date.now() > e.expiresAt) {
    store.delete(key);
    stats.misses++;
    console.log(`[CACHE] Expired: ${key}, Total Misses: ${stats.misses}`);
    return null;
  }
  stats.hits++;
  console.log(`[CACHE] Hit: ${key}, Total Hits: ${stats.hits}, Hit Ratio: ${(stats.hits / (stats.hits + stats.misses) * 100).toFixed(2)}%`);
  return e.value;
}

export function getCacheStats() {
  return {
    ...stats,
    hitRatio: stats.hits + stats.misses > 0 ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(2) : 0,
    size: store.size
  };
}
