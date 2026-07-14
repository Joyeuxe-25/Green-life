import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { fetchSiteSettings, resolvePublicUrl } from "@/lib/public-api";
import { getSetting } from "@/components/public-components";

const footerLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Donate", href: "/donate" }
];

const socialSettingKeys = [
  { key: "social.facebook", label: "Facebook" },
  { key: "social.instagram", label: "Instagram" },
  { key: "social.x", label: "X" },
  { key: "social.linkedin", label: "LinkedIn" },
  { key: "social.youtube", label: "YouTube" }
];

export async function SiteFooter() {
  const { siteSettings } = await fetchSiteSettings().catch(() => ({
    siteSettings: []
  }));
  const siteName = getSetting(siteSettings, "site.name") || "Green for Life Rwanda";
  const logoUrl = resolvePublicUrl(
    getSetting(siteSettings, "site.footer_logo_url") ||
    getSetting(siteSettings, "site.logo_url")
  );
  const footerText =
    getSetting(siteSettings, "footer.summary") ||
    getSetting(siteSettings, "footer_text");
  const copyright =
    getSetting(siteSettings, "footer.copyright") ||
    `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const email = getSetting(siteSettings, "contact.email") || getSetting(siteSettings, "site.email");
  const phone = getSetting(siteSettings, "contact.phone") || getSetting(siteSettings, "site.phone");
  const address =
    getSetting(siteSettings, "contact.address") || getSetting(siteSettings, "site.address");
  const socialLinks = socialSettingKeys
    .map((item) => ({
      ...item,
      href: getSetting(siteSettings, item.key)
    }))
    .filter((item) => item.href);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-column footer-main">
          <div className="footer-brand">
            {logoUrl ? (
              <img alt={`${siteName} logo`} className="footer-logo" src={logoUrl} />
            ) : null}
            <strong>{siteName}</strong>
          </div>
          {footerText ? <p>{footerText}</p> : null}
        </div>

        <div className="footer-column">
          <h2>Links</h2>
          <div className="footer-links">
            {footerLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {[email, phone, address, ...socialLinks.map((link) => link.href)].filter(Boolean).length > 0 ? (
          <div className="footer-column">
            <h2>Contact</h2>
            <div className="footer-contact">
              {email ? (
                <p>
                  <Mail aria-hidden="true" size={16} />
                  <span>{email}</span>
                </p>
              ) : null}
              {phone ? (
                <p>
                  <Phone aria-hidden="true" size={16} />
                  <span>{phone}</span>
                </p>
              ) : null}
              {address ? (
                <p>
                  <MapPin aria-hidden="true" size={16} />
                  <span>{address}</span>
                </p>
              ) : null}
            </div>
            {socialLinks.length > 0 ? (
              <div className="footer-social" aria-label="Social links">
                {socialLinks.map((link) => (
                  <a href={link.href} key={link.key}>
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        <FooterIllustration />
      </div>
      <div className="container footer-bottom">
        <p>{copyright}</p>
      </div>
    </footer>
  );
}

function FooterIllustration() {
  return (
    <div className="footer-illustration" aria-hidden="true">
      <svg viewBox="0 0 560 170" role="img" focusable="false">
        <path
          d="M28 132c42-34 90-50 145-48 35 2 57 12 88 29 39 20 77 23 119 10 54-16 96-15 152 10"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="10"
        />
        <path
          d="M0 149h560"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <g className="footer-tree">
          <path d="M104 145V78" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="7" />
          <path d="M104 104c-13-13-25-18-42-19 5-21 22-37 42-39 21 2 38 18 42 39-17 1-29 6-42 19Z" />
          <path d="M104 88c10-15 23-24 41-28" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
          <path d="M104 96c-11-13-23-20-39-23" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
        </g>
        <g className="footer-tree small">
          <path d="M251 145V94" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="6" />
          <path d="M251 110c-10-11-20-15-34-16 4-17 17-30 34-32 17 2 30 15 34 32-14 1-24 5-34 16Z" />
        </g>
        <g className="footer-tree">
          <path d="M438 145V72" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="7" />
          <path d="M438 98c-14-14-28-20-47-21 6-24 24-42 47-44 24 2 43 20 48 44-19 1-33 7-48 21Z" />
          <path d="M438 89c12-16 26-26 46-30" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
          <path d="M438 103c-13-14-27-22-45-26" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
        </g>
        <g className="footer-birds" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
          <path d="M214 38c9-8 19-8 28 0" />
          <path d="M242 38c9-8 19-8 28 0" />
          <path d="M346 52c7-6 15-6 22 0" />
          <path d="M368 52c7-6 15-6 22 0" />
        </g>
      </svg>
    </div>
  );
}
