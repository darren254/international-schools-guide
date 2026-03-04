/**
 * Shared city config for listing and compare pages.
 * Single source for city slug -> schools + display name.
 */

import type { SchoolListing } from "@/app/international-schools/ExploreSchoolsClient";
import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { DUBAI_SCHOOLS } from "@/data/dubai-schools";
import { SINGAPORE_SCHOOLS } from "@/data/singapore-schools";
import { BANGKOK_SCHOOLS } from "@/data/bangkok-schools";
import { HONG_KONG_SCHOOLS } from "@/data/hong-kong-schools";
import { KUALA_LUMPUR_SCHOOLS } from "@/data/kuala-lumpur-schools";

const CITY_SCHOOLS: Record<string, SchoolListing[]> = {
  jakarta: JAKARTA_SCHOOLS,
  dubai: DUBAI_SCHOOLS,
  singapore: SINGAPORE_SCHOOLS,
  bangkok: BANGKOK_SCHOOLS,
  "hong-kong": HONG_KONG_SCHOOLS,
  "kuala-lumpur": KUALA_LUMPUR_SCHOOLS,
};

export function getCitySchools(citySlug: string): SchoolListing[] | null {
  return CITY_SCHOOLS[citySlug] ?? null;
}

export function getCityName(citySlug: string): string {
  return citySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function isValidCitySlug(citySlug: string): boolean {
  return citySlug in CITY_SCHOOLS;
}
