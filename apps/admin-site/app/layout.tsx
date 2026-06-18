import type { Metadata } from "next";
import {
  ADMIN_APPLE_TOUCH_ICON_URL,
  ADMIN_FAVICON_32_URL,
  ADMIN_FAVICON_URL
} from "@/lib/admin-brand-assets";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Life Rwanda Admin",
  description: "Green Life Rwanda admin dashboard.",
  icons: {
    icon: [
      { url: ADMIN_FAVICON_URL },
      { rel: "icon", sizes: "32x32", url: ADMIN_FAVICON_32_URL }
    ],
    apple: [{ url: ADMIN_APPLE_TOUCH_ICON_URL }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
