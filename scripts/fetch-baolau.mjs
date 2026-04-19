#!/usr/bin/env node
/**
 * Fetches the Baolau transport locations and saves them to public/baolau_locations.json.
 * Runs automatically as a Next.js prebuild step.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', 'public', 'baolau_locations.json');

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
    writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
    const count = Array.isArray(data) ? data.length : '?';
    console.log(`Saved ${count} locations → public/baolau_locations.json`);
  } catch (err) {
    console.warn(`Warning: Could not fetch Baolau locations (${err.message}). Using existing file.`);
  }
}

main();
