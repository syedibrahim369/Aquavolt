# Cross-platform setup (Windows & Linux)

This is a Vite + React + TypeScript app that talks to Supabase. The scripts in `package.json` are already OS-agnostic; follow the steps below to run on Windows (PowerShell) or Linux shells.

## Prereqs
- Node.js 18+ (use `nvm install 18 && nvm use 18` on Linux/macOS, or `nvm install 18`/`nvm use 18` in PowerShell with nvm-windows).
- npm (bundled with Node).
- Optional: Supabase CLI + Docker if you want to run the provided database migrations locally.

## Quick start
1) Clone/extract this folder and open a terminal at `project/`.
2) Copy `env.example` to `.env` (or `.env.local`) and fill in your Supabase values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3) Install deps: `npm install`
4) Dev server: `npm run dev`
   - On Windows/PowerShell and Linux the command is the same; Vite prints the local URL (default `http://localhost:5173`).
5) Build for production: `npm run build`
6) Preview the build locally: `npm run preview`

## Supabase migrations (optional)
If you want to mirror the schema locally with the Supabase CLI:
- Start services: `supabase start` (needs Docker)
- Apply migrations: `supabase db push` (or `supabase db reset` to reapply from `supabase/migrations`)

These commands work in both PowerShell and bash. If Docker is unavailable on Windows, you can run them inside WSL.

## C++/WebAssembly acceleration
- Heavy math helpers (trend/variance) in the prediction engine can run via WebAssembly.
- Feeding optimizer scoring/adjustment also has a WASM path with JS fallback.
- Prereq: install Emscripten (emsdk). On Windows, WSL is easiest; native works if `emcc` is on PATH. On Linux/macOS: `./emsdk install latest && ./emsdk activate latest && source emsdk_env.sh`.
- Build the module: `npm run build:wasm` (emits `public/wasm/prediction.js/.wasm`).
- The app falls back to JS if the WASM build is missing or fails to load.
- To preload the module earlier, you can call `preloadPredictionWasm()` from app startup if desired.

## Notes
- The MacOS metadata folder `__MACOSX/` can be ignored or deleted; it is not used by the app.
- If ports are busy, set a custom port: `npm run dev -- --port 5174`.
- For LAN/mobile testing add `--host`: `npm run dev -- --host`.

