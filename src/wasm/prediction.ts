// Lightweight WASM loader for prediction math helpers.
// Falls back to null if the module is missing or fails to load.

type WasmModule = {
  HEAPF32: Float32Array;
  _malloc: (n: number) => number;
  _free: (ptr: number) => void;
  _calculate_trend: (ptr: number, n: number) => number;
  _calculate_variance: (ptr: number, n: number) => number;
};

let wasmModule: WasmModule | null = null;
let loadAttempted = false;

const modulePromise: Promise<WasmModule | null> = (async () => {
  try {
    // Served from /public/wasm after running `npm run build:wasm`
    // The generated module is an ES module factory.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - runtime import of generated file
    const factory = (await import('/wasm/prediction.js')).default;
    const mod: WasmModule = await factory();
    wasmModule = mod;
    return mod;
  } catch (err) {
    console.warn('[wasm] prediction module load failed, using JS fallback', err);
    return null;
  } finally {
    loadAttempted = true;
  }
})();

function getModuleSync(): WasmModule | null {
  return wasmModule;
}

/**
 * Kick off loading; callers can optionally await this to ensure the module is ready.
 */
export async function preloadPredictionWasm(): Promise<boolean> {
  const mod = await modulePromise;
  return Boolean(mod);
}

function withBuffer(values: Float32Array, fn: (ptr: number) => number): number | null {
  const mod = getModuleSync();
  if (!mod) return null;

  const bytes = values.length * values.BYTES_PER_ELEMENT;
  const ptr = mod._malloc(bytes);
  try {
    mod.HEAPF32.set(values, ptr / 4);
    return fn(ptr);
  } finally {
    mod._free(ptr);
  }
}

export function calculateTrendWasm(values: number[]): number | null {
  const mod = getModuleSync();
  if (!mod && !loadAttempted) {
    // Fire-and-forget load to warm it up for subsequent calls.
    void modulePromise;
  }
  return withBuffer(new Float32Array(values), ptr => {
    return wasmModule?._calculate_trend(ptr, values.length) ?? 0;
  });
}

export function calculateVarianceWasm(values: number[]): number | null {
  const mod = getModuleSync();
  if (!mod && !loadAttempted) {
    void modulePromise;
  }
  return withBuffer(new Float32Array(values), ptr => {
    return wasmModule?._calculate_variance(ptr, values.length) ?? 0;
  });
}

