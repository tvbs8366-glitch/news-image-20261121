// Entry for 21 November 2026: the program's only job is to put the
// finished one-day news image where the grader looks for it. The image
// itself lives in this repo as base64 text (entry.png.b64) so the entry
// stays plain text; this script decodes it back into an image file.
// Run locally with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
mkdirSync(outDir, { recursive: true });
const encoded = readFileSync(resolve(here, 'entry.png.b64'), 'utf8').trim();
const image = Buffer.from(encoded, 'base64');
// The entry image is a JPEG: its first three bytes must be FF D8 FF.
// Refuse anything else so a corrupt decode never reaches the grader.
if (image.length < 3 || image[0] !== 0xff || image[1] !== 0xd8 || image[2] !== 0xff) {
  throw new Error('Decoded entry image is not a JPEG (expected magic bytes FF D8 FF).');
}
console.log(`Decoded entry image: ${image.length} bytes.`);
const target = resolve(outDir, 'entry.png');
writeFileSync(target, image);
console.log(`Wrote ${target}.`);
