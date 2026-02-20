import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import { ExploreSchoolsClient } from "./ExploreSchoolsClient";

export default function ExploreSchoolsPage() {
  return <ExploreSchoolsClient profileSlugs={ALL_SCHOOL_SLUGS} />;
}
