import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

let date;
try {
    date = execSync('git log -1 --format=%cs HEAD', { encoding: 'utf8' }).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('unexpected format');
} catch {
    date = new Date().toISOString().slice(0, 10);
}
const year = date.slice(0, 4);

function patchFile(path, replacements) {
    const before = readFileSync(path, 'utf8');
    let after = before;
    for (const [pattern, replacement] of replacements) {
        after = after.replace(pattern, replacement);
    }
    if (before === after) {
        console.log(`${path}: already up to date`);
    } else {
        writeFileSync(path, after);
        console.log(`${path}: updated`);
    }
}

patchFile('sitemap.xml', [
    [/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${date}</lastmod>`]
]);

const yearReplacement = [/<span class="year">[^<]*<\/span>/g, `<span class="year">${year}</span>`];
patchFile('index.html', [yearReplacement]);
patchFile('fr.html', [yearReplacement]);

console.log(`\nBuild patches applied for ${date} (year ${year}).`);
