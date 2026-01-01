import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const outDir = join(projectRoot, 'public', 'wasm');
const builds = [
  {
    name: 'prediction',
    src: join(__dirname, 'prediction.cpp'),
    outJs: join(outDir, 'prediction.js'),
    exported: "_calculate_trend,_calculate_variance",
  },
  {
    name: 'feeding',
    src: join(__dirname, 'feeding.cpp'),
    outJs: join(outDir, 'feeding.js'),
    exported: "_calculate_environment_score,_calculate_feeding_adjustment",
  }
];

function ensureOutDir() {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
}

function runEmcc(src, outJs, exported) {
  const args = [
    src,
    '-O3',
    '-std=c++17',
    '-sENVIRONMENT=web',
    '-sMODULARIZE=1',
    '-sEXPORT_ES6=1',
    '-sALLOW_MEMORY_GROWTH=1',
    `-sEXPORTED_FUNCTIONS=['${exported}','_malloc','_free']`,
    "-sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']",
    '-sASSERTIONS=0',
    '-o',
    outJs,
  ];

  const result = spawnSync('emcc', args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function main() {
  ensureOutDir();
  console.log('Building WASM with emcc...');
  for (const b of builds) {
    console.log(`- ${b.name}`);
    runEmcc(b.src, b.outJs, b.exported);
  }
  console.log('Done.');
}

main();

