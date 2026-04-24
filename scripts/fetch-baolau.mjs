#!/usr/bin/env node
/**
 * Refreshes public/baolau_locations.json from the Baolau API as a Next.js
 * prebuild step.
 *
 * Fallback strategy:
 *   - The file is committed to the repo as a last-known-good baseline.
 *   - On fetch success we atomically replace it (temp file + rename) so a
 *     crash mid-write can never leave a truncated JSON on disk.
 *   - On fetch failure we leave the committed file untouched and exit 0, so
 *     the deploy still ships valid JSON.
 *   - If no file exists at all after the attempt (shouldn't happen, since
 *     it's committed), we exit non-zero to fail the build loudly rather than
 *     shipping a 404.
 */
import { existsSync, renameSync, unlinkSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'public', 'baolau_locations.json');
const TMP = `${OUTPUT}.tmp`;

async function main() {
  console.log('Fetching Baolau locations…');
  try {
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
  } catch (err) {
    if (existsSync(TMP)) {
      try { unlinkSync(TMP); } catch {}
    }
    if (existsSync(OUTPUT)) {
      console.warn(
        `Warning: Could not refresh Baolau locations (${err.message}). ` +
          `Keeping committed fallback at public/baolau_locations.json.`,
      );
      return;
    }
    console.error(
      `Error: Baolau fetch failed (${err.message}) and no fallback file ` +
        `exists at public/baolau_locations.json. Commit a baseline (even an ` +
        `empty array) so builds never ship a 404 for this asset.`,
    );
    process.exit(1);
  }
}

main();
