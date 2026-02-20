import { JAKARTA_SCHOOLS } from "@/data/jakarta-schools";
import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import { ExploreSchoolsClient } from "./ExploreSchoolsClient";

export default function ExploreSchoolsPage() {
  return (
    <ExploreSchoolsClient
      schools={JAKARTA_SCHOOLS}
      profileSlugs={ALL_SCHOOL_SLUGS}
    />
  );
}
