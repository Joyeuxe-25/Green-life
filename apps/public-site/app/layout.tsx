import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Life Rwanda",
  description: "Future Green Life Rwanda public website."
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
