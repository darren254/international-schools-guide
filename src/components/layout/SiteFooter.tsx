import Link from "next/link";
import { FooterAuth } from "./FooterAuth";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-cream-400 pt-16 pb-8">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
          <div>
            <p className="font-display text-lg font-semibold text-cream mb-4">
              International Schools <span className="text-primary">Guide</span>
            </p>
            <p className="text-sm text-charcoal-muted leading-relaxed max-w-sm">
              Helping expat families choose international schools with
              fair, balanced information.
            </p>
          </div>

          <div>
            <p className="text-label-xs uppercase text-charcoal-muted mb-5">Explore</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/international-schools/" className="text-sm hover:text-cream transition-colors">Schools</Link>
              </li>
              <li>
                <Link href="/insights/" className="text-sm hover:text-cream transition-colors">Insights</Link>
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
            <p className="text-label-xs uppercase text-charcoal-muted mb-5">Is your school listed?</p>
            <p className="text-sm text-charcoal-muted leading-relaxed mb-3">
              We profile every international school independently. Spot something wrong? We&apos;d like to hear from you.
            </p>
            <a
              href="mailto:mia@international-schools-guide.com?subject=School%20listing%20enquiry"
              className="text-sm hover:text-cream transition-colors inline-block"
            >
              Get in touch →
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-charcoal-light/40 pt-6 text-xs text-charcoal-muted">
          <span>&copy; {new Date().getFullYear()} International Schools Guide. All rights reserved.</span>
          <div className="flex items-center gap-6 mt-3 md:mt-0">
            <FooterAuth />
            <Link href="/privacy/" className="hover:text-cream-400 transition-colors">Privacy</Link>
            <Link href="/terms/" className="hover:text-cream-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
