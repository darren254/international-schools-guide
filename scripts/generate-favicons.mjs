#!/usr/bin/env node
/**
 * Generate favicon.ico (32x32), favicon-32x32.png, and apple-touch-icon.png (180x180)
 * from public/favicon.svg. Run: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const svgPath = join(publicDir, "favicon.svg");

const svgBuffer = readFileSync(svgPath);

async function main() {
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();

  writeFileSync(join(publicDir, "favicon-32x32.png"), png32);
  writeFileSync(join(publicDir, "apple-touch-icon.png"), png180);

  const icoBuffer = await toIco([png32]);
  writeFileSync(join(publicDir, "favicon.ico"), icoBuffer);

  console.log("Generated favicon.ico, favicon-32x32.png, apple-touch-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
