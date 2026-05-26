import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IMG_DIR = './images';
const QUALITY = 75;
const MAX_WIDTH = 1920;

const files = readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png)$/i.test(f));

if (files.length === 0) {
    console.log('No JPG/PNG files found in', IMG_DIR);
    process.exit(0);
}

const fmt = (b) => b < 1024 * 1024
    ? `${(b / 1024).toFixed(0)} KB`
    : `${(b / 1024 / 1024).toFixed(2)} MB`;

let totalBefore = 0;
let totalAfter = 0;
const results = [];

for (const file of files) {
    const inputPath = join(IMG_DIR, file);
    const outputPath = join(IMG_DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));

    const beforeSize = statSync(inputPath).size;
    totalBefore += beforeSize;

    try {
        const image = sharp(inputPath);
        const meta = await image.metadata();

        let pipeline = image;
        if (meta.width && meta.width > MAX_WIDTH) {
            pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        }

        await pipeline.webp({ quality: QUALITY }).toFile(outputPath);

        const afterSize = statSync(outputPath).size;
        totalAfter += afterSize;
        const saved = ((1 - afterSize / beforeSize) * 100).toFixed(1);
        results.push({ file, beforeSize, afterSize, saved, width: meta.width });
    } catch (err) {
        console.error(`Failed on ${file}: ${err.message}`);
    }
}

console.log('\n=== Image optimization report ===\n');
console.log('File'.padEnd(30) + 'Before'.padStart(12) + 'After'.padStart(12) + 'Saved'.padStart(10));
console.log('-'.repeat(64));
for (const r of results) {
    console.log(
        r.file.padEnd(30) +
        fmt(r.beforeSize).padStart(12) +
        fmt(r.afterSize).padStart(12) +
        `-${r.saved}%`.padStart(10)
    );
}
console.log('-'.repeat(64));
const totalSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
console.log(
    'TOTAL'.padEnd(30) +
    fmt(totalBefore).padStart(12) +
    fmt(totalAfter).padStart(12) +
    `-${totalSaved}%`.padStart(10)
);
console.log('\n.webp files generated next to originals. .jpg/.png files NOT deleted (delete manually after verification).');
