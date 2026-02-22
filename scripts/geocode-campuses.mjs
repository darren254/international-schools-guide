#!/usr/bin/env node
/**
 * Geocode every campus address via Google Geocoding API.
 * Reads scripts/campus-addresses.json, writes src/data/campus-coordinates.json.
 * Requires: GOOGLE_GEOCODING_API_KEY in env.
 * Run: node scripts/geocode-campuses.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const key = process.env.GOOGLE_GEOCODING_API_KEY;
if (!key) {
  console.error("Set GOOGLE_GEOCODING_API_KEY in your environment.");
  process.exit(1);
}

const addressesPath = join(__dirname, "campus-addresses.json");
const outPath = join(__dirname, "..", "src", "data", "campus-coordinates.json");

const list = JSON.parse(readFileSync(addressesPath, "utf-8"));

// Group by slug so output is { slug: [ { lat, lng }, ... ] }
const bySlug = {};
for (const row of list) {
  if (!bySlug[row.slug]) bySlug[row.slug] = [];
  bySlug[row.slug].push({ name: row.name, address: row.address });
}

async function geocode(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=id&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.results?.[0]) {
    console.warn(`  Geocode failed: ${address} -> ${data.status}`);
    return null;
  }
  const loc = data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
}

const result = {};
for (const slug of Object.keys(bySlug)) {
  const campuses = bySlug[slug];
  result[slug] = [];
  for (let i = 0; i < campuses.length; i++) {
    const { address } = campuses[i];
    process.stdout.write(`  ${slug} [${i + 1}/${campuses.length}] ${address.slice(0, 50)}... `);
    const coords = await geocode(address);
    result[slug].push(coords || { lat: null, lng: null });
    if (coords) console.log(`${coords.lat}, ${coords.lng}`);
    else console.log("(skipped)");
    await new Promise((r) => setTimeout(r, 200));
  }
}

writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
console.log(`Wrote ${outPath}`);
