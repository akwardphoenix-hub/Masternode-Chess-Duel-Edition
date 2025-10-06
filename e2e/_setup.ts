// e2e/_setup.ts
import { installOfflineGuards } from '../src/test/offline-net-guard';

installOfflineGuards();

// Provide harmless mocks for any "online" dependencies used by the app:
(globalThis as any).__LLM__ = {
  generate: async () => ({ text: 'mocked', latencyMs: 3 }),
};
(globalThis as any).__KV__ = {
  get: async () => null,
  set: async () => true,
};

console.log('[E2E Setup] Offline guards installed, mocks configured');
