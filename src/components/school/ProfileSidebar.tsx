import { Button } from "@/components/ui/Button";

export function ProfileSidebar() {
  return (
    <aside className="self-start">
      <div className="lg:sticky lg:top-[88px] bg-warm-white border border-primary p-6">
        <p className="font-display text-base font-semibold mb-2">
          Are you from this school?
        </p>
        <p className="text-body-xs text-charcoal-muted mb-4 leading-relaxed">
          Accurate, up-to-date information matters to families. Update your listing or get in touch about featured opportunities.
        </p>
        <Button as="a" href="/contact/" variant="primary" fullWidth>
          Get in Touch
        </Button>
      </div>
    </aside>
  );
}
