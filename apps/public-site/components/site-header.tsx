import Link from "next/link";
import { DesktopNavMenu } from "@/components/desktop-nav-menu";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { getSetting } from "@/components/public-components";
import { fetchSiteSettings, resolvePublicUrl } from "@/lib/public-api";

const primaryNavigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Contact", href: "/contact" }
];

const moreNavigationItems = [
  { label: "Programs", href: "/programs" },
  { label: "Partners", href: "/partners" },
  { label: "Staff", href: "/staff" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" }
];

const mobileNavigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Partners", href: "/partners" },
  { label: "Staff", href: "/staff" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" }
];

const actionItems = [
  { label: "Donate", href: "/donate" },
  { label: "Get Involved", href: "/get-involved" }
];

export async function SiteHeader() {
  const { siteSettings } = await fetchSiteSettings().catch(() => ({
    siteSettings: []
  }));
  const siteName = getSetting(siteSettings, "site.name") || "Green Life Rwanda";
  const logoUrl = resolvePublicUrl(getSetting(siteSettings, "site.logo_url"));

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          {logoUrl ? (
            <img alt={`${siteName} logo`} className="brand-logo" src={logoUrl} />
          ) : null}
          <span>{siteName}</span>
        </Link>
        <DesktopNavMenu moreItems={moreNavigationItems} primaryItems={primaryNavigationItems} />
        <div className="nav-actions" aria-label="Public actions">
          {actionItems.map((item) => (
            <Link className={item.href === "/donate" ? "nav-donate" : "nav-action"} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <MobileNavMenu
          actionItems={actionItems}
          logoUrl={logoUrl}
          navigationItems={mobileNavigationItems}
          siteName={siteName}
        />
      </div>
    </header>
  );
}
