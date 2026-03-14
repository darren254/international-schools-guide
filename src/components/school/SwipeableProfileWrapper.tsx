"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";

type Props = {
  prevUrl: string | null;
  nextUrl: string | null;
  children: ReactNode;
};

export function SwipeableProfileWrapper({ prevUrl, nextUrl, children }: Props) {
  const router = useRouter();

  const navigatePrev = useCallback(() => {
    if (prevUrl) router.push(prevUrl);
  }, [prevUrl, router]);

  const navigateNext = useCallback(() => {
    if (nextUrl) router.push(nextUrl);
  }, [nextUrl, router]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigatePrev, navigateNext]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: navigateNext,
    onSwipedRight: navigatePrev,
    delta: 80,
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: false,
  });

  return <div {...swipeHandlers}>{children}</div>;
}
