"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SchoolRow = {
  id: string;
  name: string;
  slug: string;
  citySlug: string | null;
  imageCount: number;
};

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const url = cityFilter ? `/api/admin/schools?city=${encodeURIComponent(cityFilter)}` : "/api/admin/schools";
    fetch(url, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("Unauthorized");
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSchools(d.schools ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [cityFilter]);

  if (loading) {
    return (
      <div className="py-12 text-center text-charcoal-muted">
        Loading schools…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/login" className="text-primary hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  const cities = Array.from(new Set(schools.map((s) => s.citySlug).filter(Boolean))) as string[];

  return (
    <div>
      <h1 className="font-display text-display-md text-charcoal mb-2">Schools</h1>
      <p className="text-body-sm text-charcoal-muted mb-6">
        Edit profiles and manage images. Data is stored in the database and synced to the site on publish.
      </p>
      {cities.length > 0 && (
        <div className="mb-6">
          <label htmlFor="city" className="block text-label-sm text-charcoal mb-1">
            Filter by city
          </label>
          <select
            id="city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 border border-warm-border rounded text-charcoal bg-warm-white"
          >
            <option value="">All cities</option>
            {cities.sort().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}
      {schools.length === 0 ? (
        <div className="bg-warm-white border border-warm-border rounded-lg p-8 text-center text-charcoal-muted">
          No schools in the database yet. Run the sync/seed script to import from the static data.
        </div>
      ) : (
        <div className="border border-warm-border rounded-lg overflow-hidden bg-warm-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-warm-border bg-cream/50">
                <th className="px-4 py-3 text-label-sm font-medium text-charcoal">School</th>
                <th className="px-4 py-3 text-label-sm font-medium text-charcoal">City</th>
                <th className="px-4 py-3 text-label-sm font-medium text-charcoal">Images</th>
                <th className="px-4 py-3 text-label-sm font-medium text-charcoal" />
              </tr>
            </thead>
            <tbody>
              {schools.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-warm-border last:border-0 hover:bg-cream/30 transition-colors"
                >
                  <td className="px-4 py-3 font-body text-body-sm text-charcoal">{s.name}</td>
                  <td className="px-4 py-3 text-body-sm text-charcoal-muted">{s.citySlug ?? "—"}</td>
                  <td className="px-4 py-3 text-body-sm text-charcoal-muted">{s.imageCount}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/schools/${s.slug}`}
                      className="text-primary hover:underline text-body-sm font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
