"use client";

import { useShortlist } from "@/context/ShortlistContext";
import { Button } from "@/components/ui/Button";

type Props = {
  slug: string;
  fullWidth?: boolean;
  layout?: "row" | "column";
};

export function ShortlistActions({ slug, fullWidth = false, layout = "row" }: Props) {
  const { isShortlisted, toggleShortlist, shortlistedSlugs } = useShortlist();
  const shortlisted = isShortlisted(slug);
  const compareHref =
    shortlistedSlugs.length >= 1
      ? `/compare?schools=${Array.from(new Set([...shortlistedSlugs, slug])).slice(0, 4).join(",")}`
      : `/compare?schools=${slug}`;

  return (
    <div className={`flex gap-2 ${layout === "column" ? "flex-col" : "flex-row"}`}>
      <Button
        variant="outline"
        fullWidth={fullWidth}
        onClick={() => toggleShortlist(slug)}
        aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
      >
        {shortlisted ? "✓ Shortlisted" : "♡ Shortlist"}
      </Button>
      <Button
        as="a"
        href={compareHref}
        variant="outline"
        fullWidth={fullWidth}
      >
        + Compare
      </Button>
    </div>
  );
}
