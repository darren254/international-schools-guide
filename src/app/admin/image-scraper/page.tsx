import ImageScraperClient from "./image-scraper-client";

export default function AdminImageScraperPage() {
  return (
    <div>
      <h1 className="font-display text-display-md text-charcoal mb-2">Image Scraper</h1>
      <p className="text-body-sm text-charcoal-muted mb-6">
        Paste school names (one per line), match to database schools, then fetch up to 5 images per school via Google Images. Save selected images to the school gallery.
      </p>
      <ImageScraperClient />
    </div>
  );
}
