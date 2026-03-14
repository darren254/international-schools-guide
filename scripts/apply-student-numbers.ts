/**
 * Apply student numbers from data/student-numbers.json to city school listing files.
 * Updates the `studentCount` field in each city's schools.ts file.
 *
 * Usage: npx tsx scripts/apply-student-numbers.ts
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STUDENT_FILE = path.join(process.cwd(), "data", "student-numbers.json");

type StudentEntry = {
  bestEstimate: number;
  display: string;
  isApproximate: boolean;
  sourceCount: number;
  topSources: { value: string; date: string | null; source: string }[];
};

const CITY_FILES = [
  "singapore-schools.ts",
  "bangkok-schools.ts",
  "kuala-lumpur-schools.ts",
  "jakarta-schools.ts",
  "dubai-schools.ts",
  "hong-kong-schools.ts",
];

function main() {
  const studentData: Record<string, StudentEntry> = JSON.parse(
    fs.readFileSync(STUDENT_FILE, "utf8")
  );

  let totalUpdated = 0;

  for (const filename of CITY_FILES) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (not found)`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf8");
    let fileUpdated = 0;

    for (const [slug, entry] of Object.entries(studentData)) {
      // Match: slug: "the-slug", ... studentCount: "..."
      // We need to find lines containing this slug and update studentCount
      const slugPattern = new RegExp(
        `(slug:\\s*"${slug}"[^}]*?studentCount:\\s*)"([^"]*)"`,
        "g"
      );

      content = content.replace(slugPattern, (_match, prefix, oldValue) => {
        if (oldValue !== entry.display) fileUpdated++;
        return `${prefix}"${entry.display}"`;
      });
    }

    if (fileUpdated > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`${filename}: updated ${fileUpdated} schools`);
      totalUpdated += fileUpdated;
    } else {
      console.log(`${filename}: no changes needed`);
    }
  }

  console.log(`\nTotal updated: ${totalUpdated} schools`);
}

main();
