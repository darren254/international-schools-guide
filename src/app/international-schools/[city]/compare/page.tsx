import { redirect } from "next/navigation";
import { LIVE_CITIES } from "@/data/cities";

export function generateStaticParams() {
  return LIVE_CITIES.map((c) => ({ city: c.slug }));
}

export default function CityComparePage() {
  redirect("/shortlist");
}
