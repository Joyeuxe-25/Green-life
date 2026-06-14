import Link from "next/link";
import { fetchSiteSettings } from "@/lib/public-api";
import { getSetting } from "@/components/public-components";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Projects", href: "/projects" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" }
];

export async function SiteFooter() {
  const { siteSettings } = await fetchSiteSettings().catch(() => ({
    siteSettings: []
  }));
  const footerText = getSetting(siteSettings, "footer_text");

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <strong>Green Life Rwanda</strong>
        {footerText ? <p>{footerText}</p> : null}
        <div className="footer-links">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
