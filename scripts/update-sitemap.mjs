import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

let date;
try {
    date = execSync('git log -1 --format=%cs HEAD', { encoding: 'utf8' }).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('unexpected format');
} catch {
    date = new Date().toISOString().slice(0, 10);
}

const path = 'sitemap.xml';
const before = readFileSync(path, 'utf8');
const after = before.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${date}</lastmod>`
);

if (before === after) {
    console.log(`sitemap.xml already up to date (${date})`);
} else {
    writeFileSync(path, after);
    console.log(`sitemap.xml lastmod set to ${date}`);
}
