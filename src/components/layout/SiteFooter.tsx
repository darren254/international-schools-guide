import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-[#B0ACA5] pt-16 pb-8">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
          <div>
            <p className="font-display text-lg font-semibold text-cream mb-4">
              International Schools <span className="text-hermes">Guide</span>
            </p>
            <p className="text-sm text-[#8A857E] leading-relaxed max-w-sm">
              Helping expat families navigate international school choices with
              fair, balanced information.
            </p>
          </div>

          <div>
            <p className="text-label-xs uppercase text-[#8A857E] mb-5">Explore</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/international-schools/" className="text-sm hover:text-cream transition-colors">Schools</Link>
              </li>
              <li>
                <Link href="/insights/" className="text-sm hover:text-cream transition-colors">Insights</Link>
              </li>
              <li>
                <Link href="/news/" className="text-sm hover:text-cream transition-colors">News</Link>
              </li>
              <li>
                <Link href="/about/" className="text-sm hover:text-cream transition-colors">About</Link>
              </li>
              <li>
                <Link href="/contact/" className="text-sm hover:text-cream transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-label-xs uppercase text-[#8A857E] mb-5">For Schools</p>
            <ul className="flex flex-col gap-2.5">
              {["Claim your profile", "Update Your Info", "Partner With Us"].map((label) => (
                <li key={label}>
                  <Link href="/for-schools/" className="text-sm hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-[#2E2E2E] pt-6 text-xs text-[#6A655E]">
          <span>&copy; {new Date().getFullYear()} International Schools Guide. All rights reserved.</span>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy/" className="hover:text-[#B0ACA5] transition-colors">Privacy</Link>
            <Link href="/terms/" className="hover:text-[#B0ACA5] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
