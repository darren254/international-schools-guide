"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type School = Record<string, unknown>;
type ImageRow = { id: string; variant: string; url: string; display_order: number; created_at: string };

export default function AdminSchoolEditClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [school, setSchool] = useState<School | null>(null);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});

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
          headName: String(s.head_name ?? ""),
          headBio: String(s.head_bio ?? ""),
          headCredentials: String(s.head_credentials ?? ""),
          intelligenceSummary: String(s.intelligence_summary ?? ""),
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/schools/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSchool(data.school);
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-warm-white border border-warm-border rounded-lg p-6">
          <h2 className="font-display text-display-sm text-charcoal mb-4">Overview</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { key: "name", label: "School name" },
              { key: "metaTitle", label: "Meta title" },
              { key: "metaDescription", label: "Meta description" },
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
            {["headName", "headCredentials"].map((key) => (
              <div key={key}>
                <label className="block text-label-sm text-charcoal mb-1">
                  {key === "headName" ? "Name" : "Title"}
                </label>
                <input
                  type="text"
                  value={form[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-warm-border rounded text-charcoal bg-cream focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
            <div className="md:col-span-2">
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

        <button
          type="submit"
          disabled={saving}
          className="py-2.5 px-6 bg-primary text-white font-body text-body-sm font-medium rounded hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <section className="bg-warm-white border border-warm-border rounded-lg p-6">
        <h2 className="font-display text-display-sm text-charcoal mb-4">Images</h2>
        <p className="text-body-sm text-charcoal-muted mb-4">
          Assign an image as hero, OG, or logo. Upload via API or sync script; then set the variant below.
        </p>
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
                  {img.url.startsWith("http") ? (
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="p-2">{img.url}</span>
                  )}
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
