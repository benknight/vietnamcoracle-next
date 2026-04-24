#!/usr/bin/env node
/**
 * Refreshes public/baolau_locations.json from the Baolau API.
 *
 * Usage:
 *   pnpm refresh:baolau
 *
 * Runs manually or via the quarterly GitHub Action at
 * .github/workflows/refresh-baolau.yml. There is no runtime or build-time
 * dependency on upstream — the file is served as a committed static asset.
 * Any error (network, non-2xx, unexpected shape) exits non-zero so the caller
 * notices instead of silently shipping a stale or empty file.
 */
import { renameSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'public', 'baolau_locations.json');
const TMP = `${OUTPUT}.tmp`;

console.log('Fetching Baolau locations…');
const res = await fetch('https://booking.baolau.com/en/ajax/nodes', {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; vietnamcoracle/1.0)',
  },
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
if (!Array.isArray(data)) throw new Error('Unexpected response shape');
writeFileSync(TMP, JSON.stringify(data, null, 2));
renameSync(TMP, OUTPUT);
console.log(`Saved ${data.length} locations → public/baolau_locations.json`);
