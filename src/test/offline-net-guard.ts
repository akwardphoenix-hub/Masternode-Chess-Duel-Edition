// src/test/offline-net-guard.ts
const allowHosts = new Set(['127.0.0.1', 'localhost']);

function hostFrom(url: string) {
  try { return new URL(url).hostname; }
  catch { return 'unknown'; }
}

export function installOfflineGuards() {
  // Guard global fetch
  const _fetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (input: any, init?: any) => {
    const url = typeof input === 'string' ? input : input?.url ?? '';
    const host = hostFrom(url);
    if (host && !allowHosts.has(host)) {
      throw new Error(`[OFFLINE GUARD] Blocked fetch to ${url}`);
    }
    return _fetch(input as any, init as any);
  };

  // Guard WebSocket
  const _WS = (globalThis as any).WebSocket;
  if (_WS) {
    (globalThis as any).WebSocket = function (url: string, ...rest: any[]) {
      const host = hostFrom(url);
      if (host && !allowHosts.has(host)) {
        throw new Error(`[OFFLINE GUARD] Blocked WebSocket to ${url}`);
      }
      // @ts-ignore
      return new _WS(url, ...rest);
    };
  }
}
