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
  metadataBase: new URL("https://vendortracker.eazyweb.nc"),
  alternates: {
    canonical: "https://vendortracker.eazyweb.nc",
  },
  openGraph: {
    title: "VendorTracker — Stop Overpaying for SaaS",
    description:
      "Track SaaS expenses, find waste, save money. The smartest way to manage your software stack.",
    url: "https://vendortracker.eazyweb.nc",
    siteName: "VendorTracker",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VendorTracker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://vendortracker.eazyweb.nc",
  description:
    "Track SaaS expenses, find unused tools, and save thousands. The smartest way to manage your software stack.",
  offers: [
    { "@type": "Offer", name: "Starter", price: "19", priceCurrency: "USD" },
    { "@type": "Offer", name: "Growth", price: "49", priceCurrency: "USD" },
    { "@type": "Offer", name: "Enterprise", price: "149", priceCurrency: "USD" },
  ],
  creator: { "@type": "Organization", name: "EazyWebNC", url: "https://eazyweb.nc" },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#080503] text-white">
        {children}
      </body>
    </html>
  );
}
