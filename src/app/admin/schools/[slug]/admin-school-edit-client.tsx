"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type School = Record<string, unknown>;
type ImageRow = { id: string; variant: string; url: string; display_order: number; created_at: string };
type FeeRow = {
  id: string;
  academic_year: string;
  grade_level: string;
  grade_ages: string | null;
  tuition_fee: number | null;
  capital_fee: number | null;
  total_fee_early_bird: number | null;
  total_fee_standard: number | null;
};
type OneTimeFeeRow = { id: string; academic_year: string; fee_name: string; amount: number; description: string | null };

export default function AdminSchoolEditClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [school, setSchool] = useState<School | null>(null);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [feeRows, setFeeRows] = useState<FeeRow[]>([]);
  const [oneTimeFees, setOneTimeFees] = useState<OneTimeFeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addImageVariant, setAddImageVariant] = useState("photo1");
  const [addingImage, setAddingImage] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/schools/${slug}`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("Unauthorized");
        if (r.status === 404) throw new Error("School not found");
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSchool(d.school);
        setImages(d.images ?? []);
        const s = d.school as Record<string, unknown>;
        setForm({
          name: String(s.name ?? ""),
          metaTitle: String(s.meta_title ?? ""),
          metaDescription: String(s.meta_description ?? ""),
          phone: String(s.phone ?? ""),
          email: String(s.email ?? ""),
          website: String(s.website ?? ""),
          addressFull: String(s.address_full ?? ""),
          studentCount: String(s.student_count ?? ""),
          ageRange: String(s.age_range ?? ""),
          headName: String(s.head_name ?? ""),
          headSince: String(s.head_since ?? ""),
          headBio: String(s.head_bio ?? ""),
          headCredentials: String(s.head_credentials ?? ""),
          intelligenceSummary: String(s.intelligence_summary ?? ""),
          studentBodyDescription: String(s.student_body_description ?? ""),
          academicDescription: String(s.academic_description ?? ""),
          schoolLifeDescription: String(s.school_life_description ?? ""),
          lastInspected: String(s.last_inspected ?? ""),
          inspectionBody: String(s.inspection_body ?? ""),
          inspectionRating: String(s.inspection_rating ?? ""),
          inspectionFindings: String(s.inspection_findings ?? ""),
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug || !school) return;
    fetch(`/api/admin/schools/${slug}/fees`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { feeRows: [], oneTimeFees: [] }))
      .then((d) => {
        setFeeRows(d.feeRows ?? []);
        setOneTimeFees(d.oneTimeFees ?? []);
      })
      .catch(() => {});
  }, [slug, school]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      const payload: Record<string, unknown> = { ...form };
      const headSinceVal = form.headSince?.trim();
      payload.headSince = headSinceVal ? parseInt(headSinceVal, 10) : null;
      if (Number.isNaN(payload.headSince)) payload.headSince = null;

      const res = await fetch(`/api/admin/schools/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Save failed");
      const updated = data.school as Record<string, unknown> | undefined;
      if (updated) {
        setSchool(updated);
        setForm({
          name: String(updated.name ?? ""),
          metaTitle: String(updated.meta_title ?? ""),
          metaDescription: String(updated.meta_description ?? ""),
          phone: String(updated.phone ?? ""),
          email: String(updated.email ?? ""),
          website: String(updated.website ?? ""),
          addressFull: String(updated.address_full ?? ""),
          studentCount: String(updated.student_count ?? ""),
          ageRange: String(updated.age_range ?? ""),
          headName: String(updated.head_name ?? ""),
          headSince: updated.head_since != null ? String(updated.head_since) : "",
          headBio: String(updated.head_bio ?? ""),
          headCredentials: String(updated.head_credentials ?? ""),
          intelligenceSummary: String(updated.intelligence_summary ?? ""),
          studentBodyDescription: String(updated.student_body_description ?? ""),
          academicDescription: String(updated.academic_description ?? ""),
          schoolLifeDescription: String(updated.school_life_description ?? ""),
          lastInspected: String(updated.last_inspected ?? ""),
          inspectionBody: String(updated.inspection_body ?? ""),
          inspectionRating: String(updated.inspection_rating ?? ""),
          inspectionFindings: String(updated.inspection_findings ?? ""),
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign(imageId: string, variant: string) {
    try {
      const res = await fetch(`/api/admin/schools/${slug}/images/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ imageId, variant }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, variant } : img))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assign failed");
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/admin/schools/${slug}/images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleAddImageByUrl(e: React.FormEvent) {
    e.preventDefault();
    const url = addImageUrl.trim();
    if (!url) return;
    setAddingImage(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/schools/${slug}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ variant: addImageVariant, url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed");
      if (data.image) setImages((prev) => [...prev, data.image]);
      setAddImageUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Add image failed");
    } finally {
      setAddingImage(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-charcoal-muted">
        Loading…
      </div>
    );
  }

  if (error && !school) {
    return (
      <div className="py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/schools" className="text-primary hover:underline">
          Back to schools
        </Link>
      </div>
    );
  }

const variants = ["card", "profile", "hero", "og", "logo", "photo1", "photo2", "photo3"];

function AdminImageWithFallback({ url }: { url: string }) {
  const path = url.startsWith("http") ? url : url.startsWith("/") ? url : `/${url.replace(/^\//, "")}`;
  const [src, setSrc] = useState(path);
  const [errored, setErrored] = useState(false);
  useEffect(() => {
    if (path.startsWith("http")) return;
    setSrc(`${window.location.origin}${path}`);
  }, [path]);
  if (errored) return <span className="p-2 break-all text-left">{url}</span>;
  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  );
}

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/schools" className="text-charcoal-muted hover:text-primary text-body-sm">
          ← Schools
        </Link>
        <h1 className="font-display text-display-md text-charcoal">{form.name || slug}</h1>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-body-sm text-red-800">
          {error}
        </div>
      ) : null}
      {saveSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-body-sm text-green-800">
          Saved. Changes are stored in the database; run the sync script and redeploy to update the live site.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { key: "name", label: "School name" },
              { key: "metaTitle", label: "Meta title" },
              { key: "metaDescription", label: "Meta description" },
              { key: "addressFull", label: "Address" },
              { key: "studentCount", label: "Student count" },
              { key: "ageRange", label: "Age range" },
            ].map(({ key, label }) => (
              <div key={key} className={key === "metaDescription" ? "md:col-span-2" : ""}>
                <label className="block text-label-sm text-charcoal mb-1">{label}</label>
                <input
                  type="text"
                  value={form[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Contact</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {["phone", "email", "website"].map((key) => (
              <div key={key}>
                <label className="block text-label-sm text-charcoal mb-1">{key}</label>
                <input
                  type="text"
                  value={form[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Head of School</h2>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-label-sm text-charcoal mb-1">Name</label>
                <input
                  type="text"
                  value={form.headName ?? ""}
                  onChange={(e) => handleChange("headName", e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-label-sm text-charcoal mb-1">Year started (e.g. 2020)</label>
                <input
                  type="text"
                  value={form.headSince ?? ""}
                  onChange={(e) => handleChange("headSince", e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Title / credentials</label>
              <input
                type="text"
                value={form.headCredentials ?? ""}
                onChange={(e) => handleChange("headCredentials", e.target.value)}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Bio</label>
              <textarea
                value={form.headBio ?? ""}
                onChange={(e) => handleChange("headBio", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Intelligence (editorial)</h2>
          <div>
            <label className="block text-label-sm text-charcoal mb-1">Summary</label>
            <textarea
              value={form.intelligenceSummary ?? ""}
              onChange={(e) => handleChange("intelligenceSummary", e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </section>

        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Student body &amp; academics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Student body description</label>
              <textarea
                value={form.studentBodyDescription ?? ""}
                onChange={(e) => handleChange("studentBodyDescription", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Academic description</label>
              <textarea
                value={form.academicDescription ?? ""}
                onChange={(e) => handleChange("academicDescription", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-1">School life description</label>
              <textarea
                value={form.schoolLifeDescription ?? ""}
                onChange={(e) => handleChange("schoolLifeDescription", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Inspection</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Last inspected (YYYY-MM-DD)</label>
              <input
                type="text"
                value={form.lastInspected ?? ""}
                onChange={(e) => handleChange("lastInspected", e.target.value)}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Inspection body</label>
              <input
                type="text"
                value={form.inspectionBody ?? ""}
                onChange={(e) => handleChange("inspectionBody", e.target.value)}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-1">Rating</label>
              <input
                type="text"
                value={form.inspectionRating ?? ""}
                onChange={(e) => handleChange("inspectionRating", e.target.value)}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-label-sm text-charcoal mb-1">Findings</label>
              <textarea
                value={form.inspectionFindings ?? ""}
                onChange={(e) => handleChange("inspectionFindings", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="py-2.5 px-6 bg-primary text-white font-body text-body-sm font-medium rounded hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <section className="bg-warm-white border border-warm-border rounded-lg p-6">
        <h2 className="font-display text-display-sm text-charcoal mb-4">Fees</h2>
        {feeRows.length === 0 && oneTimeFees.length === 0 ? (
          <p className="text-body-sm text-charcoal-muted">
            No fees in the database for this school. Fee tables are read from <code className="bg-cream px-1 rounded">school_fees</code> and <code className="bg-cream px-1 rounded">school_one_time_fees</code>. To show fees here and on the site, seed them from static profile data or add them via the API.
          </p>
        ) : (
          <div className="space-y-6">
            {feeRows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-body-sm">
                  <thead>
                    <tr className="border-b border-warm-border">
                      <th className="pb-2 pr-4 text-label-xs uppercase text-charcoal-muted">Year</th>
                      <th className="pb-2 pr-4 text-label-xs uppercase text-charcoal-muted">Grade</th>
                      <th className="pb-2 pr-4 text-label-xs uppercase text-charcoal-muted">Ages</th>
                      <th className="pb-2 text-right text-label-xs uppercase text-charcoal-muted">Tuition</th>
                      <th className="pb-2 text-right text-label-xs uppercase text-charcoal-muted">Total (std)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeRows.map((r) => (
                      <tr key={r.id} className="border-b border-warm-border-light">
                        <td className="py-2 pr-4 text-charcoal-muted">{r.academic_year}</td>
                        <td className="py-2 pr-4">{r.grade_level}</td>
                        <td className="py-2 pr-4 text-charcoal-muted">{r.grade_ages ?? "—"}</td>
                        <td className="py-2 text-right tabular-nums">{r.tuition_fee != null ? r.tuition_fee.toLocaleString() : "—"}</td>
                        <td className="py-2 text-right tabular-nums">{r.total_fee_standard != null ? r.total_fee_standard.toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {oneTimeFees.length > 0 && (
              <div>
                <p className="text-label-xs uppercase text-charcoal-muted mb-2">One-time fees</p>
                <ul className="space-y-1 text-body-sm">
                  {oneTimeFees.map((f) => (
                    <li key={f.id} className="flex justify-between gap-4">
                      <span>{f.fee_name}</span>
                      <span className="tabular-nums">{f.amount.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="bg-warm-white border border-warm-border rounded-lg p-6">
        <h2 className="font-display text-display-sm text-charcoal mb-4">Images</h2>
        <p className="text-body-sm text-charcoal-muted mb-4">
          Assign an image as hero, OG, or logo. Add by URL below, or upload via API; then set the variant.
        </p>
        <form onSubmit={handleAddImageByUrl} className="flex flex-wrap items-end gap-3 mb-6">
          <div className="min-w-[200px] flex-1">
            <label className="block text-label-xs text-charcoal-muted mb-1">Image URL</label>
            <input
              type="url"
              value={addImageUrl}
              onChange={(e) => setAddImageUrl(e.target.value)}
              placeholder="https://... or /images/..."
              className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30 text-body-sm"
            />
          </div>
          <div>
            <label className="block text-label-xs text-charcoal-muted mb-1">Variant</label>
            <select
              value={addImageVariant}
              onChange={(e) => setAddImageVariant(e.target.value)}
              className="px-3 py-2 border border-warm-border rounded bg-cream text-body-sm"
            >
              {variants.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={addingImage || !addImageUrl.trim()}
            className="py-2 px-4 bg-primary text-white text-body-sm font-medium rounded hover:bg-primary-hover disabled:opacity-60"
          >
            {addingImage ? "Adding…" : "Add image"}
          </button>
        </form>
        {images.length === 0 ? (
          <p className="text-body-sm text-charcoal-muted">
            No images yet. Use the API <code className="bg-cream px-1 rounded">POST /api/admin/schools/{slug}/images</code> with a file or URL, or run the sync script.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="border border-warm-border rounded-lg p-3 flex flex-col"
              >
                <div className="aspect-video bg-cream rounded mb-3 overflow-hidden flex items-center justify-center text-charcoal-muted text-body-xs">
                  <AdminImageWithFallback url={img.url} />
                </div>
                <p className="text-label-sm text-charcoal-muted mb-2">Current: {img.variant}</p>
                <select
                  value={img.variant}
                  onChange={(e) => handleAssign(img.id, e.target.value)}
                  className="mb-2 px-2 py-1.5 border border-warm-border rounded text-body-sm bg-cream"
                >
                  {variants.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="text-body-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
