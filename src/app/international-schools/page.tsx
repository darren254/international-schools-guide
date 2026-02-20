import { redirect } from "next/navigation";
import { LIVE_CITIES } from "@/data/cities";

/**
 * /international-schools/ redirects to the canonical listing for the only live city.
 * When more cities are live, this could become an index page listing them.
 */
export default function InternationalSchoolsIndexPage() {
  const firstLive = LIVE_CITIES[0];
  if (firstLive) {
    redirect(`/international-schools/${firstLive.slug}/`);
  }
  redirect("/");
}
