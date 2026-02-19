interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-verified align-middle ml-3">
        <span className="w-2 h-2 rounded-full bg-verified inline-block" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-charcoal-muted align-middle ml-3">
      <span className="w-2 h-2 rounded-full bg-charcoal-muted/40 inline-block" />
      Unverified
    </span>
  );
}
