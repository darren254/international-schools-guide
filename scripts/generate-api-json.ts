#!/usr/bin/env tsx
/**
 * Generates static JSON API files for external consumers (e.g. Claude bot).
 * Run before build; outputs to public/api/ so they're deployed with the site.
 *
 * Usage: npx tsx scripts/generate-api-json.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { SCHOOL_PROFILES } from "../src/data/schools";
import type { SchoolProfile } from "../src/data/schools";

function flattenConsideration(c: string | { text: string; link: { url: string; label: string } }): string {
  return typeof c === "string" ? c : c.text;
}

function toApiProfile(p: SchoolProfile) {
  return {
    slug: p.slug,
    name: p.name,
    shortName: p.shortName,
    citySlug: p.citySlug,
    verified: p.verified,
    curricula: p.curricula,
    stats: p.stats,
    campuses: p.campuses.map((c) => ({
      name: c.name,
      address: c.address,
      grades: c.grades,
      lat: c.lat,
      lng: c.lng,
    })),
    head: p.head,
    intelligence: {
      verdict: p.intelligence.verdict,
      paragraphs: p.intelligence.paragraphs,
      positives: p.intelligence.positives,
      considerations: p.intelligence.considerations.map(flattenConsideration),
    },
    fees: {
      academicYear: p.fees.academicYear,
      feeCurrency: p.fees.feeCurrency,
      rows: p.fees.rows,
      oneTime: p.fees.oneTime,
      note: p.fees.note,
    },
    academics: {
      results: p.academics.results,
      paragraphs: p.academics.paragraphs,
    },
    studentBody: {
      paragraphs: p.studentBody.paragraphs,
      inspection: p.studentBody.inspection,
    },
    schoolLife: {
      activitiesCount: p.schoolLife.activitiesCount,
      uniformRequired: p.schoolLife.uniformRequired,
      facilities: p.schoolLife.facilities,
      paragraphs: p.schoolLife.paragraphs,
    },
    contact: p.contact,
    quickFacts: p.sidebar.quickFacts,
    metaDescription: p.metaDescription,
  };
}

function main() {
  const profiles = Object.values(SCHOOL_PROFILES);
  const apiSchools = profiles.map(toApiProfile);

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: apiSchools.length,
    schools: apiSchools,
  };

  // Output to functions/api/data/ for Cloudflare Pages Functions (auth-protected)
  const functionsDataDir = join(process.cwd(), "functions", "api", "data");
  mkdirSync(functionsDataDir, { recursive: true });
  const dataPath = join(functionsDataDir, "schools.json");
  writeFileSync(dataPath, JSON.stringify(payload, null, 0), "utf-8");
  console.log(`Wrote ${apiSchools.length} schools to ${dataPath}`);
}

main();
