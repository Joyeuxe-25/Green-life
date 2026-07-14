import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fetchSiteSettings, resolvePublicUrl } from "@/lib/public-api";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green for Life Rwanda",
  description: "Green for Life Rwanda public website."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { siteSettings } = await fetchSiteSettings().catch(() => ({
    siteSettings: []
  }));
  const faviconUrl =
    resolvePublicUrl(siteSettings.find((setting) => setting.key === "site.favicon_url")?.value) ||
    resolvePublicUrl(siteSettings.find((setting) => setting.key === "site.logo_url")?.value);
  const favicon32Url = resolvePublicUrl(
    siteSettings.find((setting) => setting.key === "site.favicon_32_url")?.value
  );
  const favicon48Url = resolvePublicUrl(
    siteSettings.find((setting) => setting.key === "site.favicon_48_url")?.value
  );
  const appleTouchIconUrl = resolvePublicUrl(
    siteSettings.find((setting) => setting.key === "site.apple_touch_icon_url")?.value
  );
  const icon192Url = resolvePublicUrl(
    siteSettings.find((setting) => setting.key === "site.icon_192_url")?.value
  );
  const icon512Url = resolvePublicUrl(
    siteSettings.find((setting) => setting.key === "site.icon_512_url")?.value
  );

  return (
    <html lang="en">
      <head>
        {faviconUrl ? <link href={faviconUrl} rel="icon" /> : null}
        {favicon32Url ? <link href={favicon32Url} rel="icon" sizes="32x32" type="image/png" /> : null}
        {favicon48Url ? <link href={favicon48Url} rel="icon" sizes="48x48" type="image/png" /> : null}
        {appleTouchIconUrl ? <link href={appleTouchIconUrl} rel="apple-touch-icon" /> : null}
        {icon192Url ? <link href={icon192Url} rel="icon" sizes="192x192" type="image/png" /> : null}
        {icon512Url ? <link href={icon512Url} rel="icon" sizes="512x512" type="image/png" /> : null}
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
