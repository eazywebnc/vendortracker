import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VendorTracker — Stop Overpaying for SaaS",
  description:
    "Track SaaS expenses, find unused tools, and save thousands. The smartest way to manage your software stack. Auto-detect subscriptions, get AI savings recommendations.",
  openGraph: {
    title: "VendorTracker — Stop Overpaying for SaaS",
    description:
      "Track SaaS expenses, find waste, save money. The smartest way to manage your software stack.",
    url: "https://vendortracker.eazyweb.nc",
    siteName: "VendorTracker",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080503] text-white">
        {children}
      </body>
    </html>
  );
}
