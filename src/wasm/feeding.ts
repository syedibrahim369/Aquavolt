// WASM-accelerated helpers for feeding optimization.
// Falls back to null when the module is missing; caller should handle null.

type WasmModule = {
  HEAPF32: Float32Array;
  _malloc: (n: number) => number;
  _free: (ptr: number) => void;
  _calculate_environment_score: (
    do_mgl: number,
    ph: number,
    turbidity_ntu: number,
    ammonia_mgl: number,
    temperature_c: number,
    fish_activity_index: number,
    thresholdsPtr: number,
    thresholdsLen: number
  ) => number;
  _calculate_feeding_adjustment: (
    do_mgl: number,
    turbidity_ntu: number,
    ammonia_mgl: number,
    fish_activity_index: number,
    temperature_c: number,
    envScore: number
  ) => number;
};

let wasmModule: WasmModule | null = null;
let loadAttempted = false;

const modulePromise: Promise<WasmModule | null> = (async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const factory = (await import('/wasm/feeding.js')).default;
    const mod: WasmModule = await factory();
    wasmModule = mod;
    return mod;
  } catch (err) {
    console.warn('[wasm] feeding module load failed, using JS fallback', err);
    return null;
  } finally {
    loadAttempted = true;
  }
})();

function getModuleSync(): WasmModule | null {
  return wasmModule;
}

export async function preloadFeedingWasm(): Promise<boolean> {
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

// thresholds should be length 13 in the order documented in feeding.cpp.
export function calculateEnvironmentScoreWasm(
  params: {
    dissolved_oxygen_mgl: number;
    ph: number;
    turbidity_ntu: number;
    ammonia_mgl: number;
    temperature_c: number;
    fish_activity_index: number;
  },
  thresholds: number[]
): number | null {
  const mod = getModuleSync();
  if (!mod && !loadAttempted) {
    void modulePromise;
  }
  if (thresholds.length < 13) return null;

  return withBuffer(new Float32Array(thresholds), ptr => {
    return wasmModule?._calculate_environment_score(
      params.dissolved_oxygen_mgl,
      params.ph,
      params.turbidity_ntu,
      params.ammonia_mgl,
      params.temperature_c,
      params.fish_activity_index,
      ptr,
      thresholds.length
    ) ?? 0;
  });
}

export function calculateFeedingAdjustmentWasm(
  params: {
    dissolved_oxygen_mgl: number;
    turbidity_ntu: number;
    ammonia_mgl: number;
    fish_activity_index: number;
    temperature_c: number;
    envScore: number;
  }
): number | null {
  const mod = getModuleSync();
  if (!mod && !loadAttempted) {
    void modulePromise;
  }

  const m = getModuleSync();
  if (!m) return null;
  return m._calculate_feeding_adjustment(
    params.dissolved_oxygen_mgl,
    params.turbidity_ntu,
    params.ammonia_mgl,
    params.fish_activity_index,
    params.temperature_c,
    params.envScore
  );
}

