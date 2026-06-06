import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Life Rwanda Admin",
  description: "Future Green Life Rwanda admin website."
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
