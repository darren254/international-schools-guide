import { ALL_SCHOOL_SLUGS } from "@/data/schools";
import AdminSchoolEditClient from "./admin-school-edit-client";

export function generateStaticParams() {
  return ALL_SCHOOL_SLUGS.map((slug) => ({ slug }));
}

export default function AdminSchoolEditPage() {
  return <AdminSchoolEditClient />;
}
