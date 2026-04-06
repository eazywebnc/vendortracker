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
    "Track SaaS expenses, find unused tools, and save thousands. Auto-detect subscriptions and get AI savings recommendations.",
  keywords: [
    "SaaS management",
    "software spend tracking",
    "SaaS expense tracker",
    "vendor management",
    "subscription management",
    "SaaS optimization",
    "reduce software costs",
    "unused SaaS detection",
  ],
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
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "VendorTracker",
      url: "https://vendortracker.eazyweb.nc",
      publisher: {
        "@type": "Organization",
        name: "EazyWebNC",
        url: "https://eazyweb.nc",
        logo: { "@type": "ImageObject", url: "https://eazyweb.nc/logo.png" },
      },
    },
    {
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
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is VendorTracker?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VendorTracker is a SaaS expense management tool that automatically detects your software subscriptions, identifies unused tools, and provides AI-powered savings recommendations.",
          },
        },
        {
          "@type": "Question",
          name: "How does VendorTracker detect unused SaaS?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VendorTracker analyzes usage patterns across your software stack to identify tools with low or no activity, helping you cut waste and save on subscriptions.",
          },
        },
        {
          "@type": "Question",
          name: "How much can VendorTracker save my company?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Companies typically save 20-30% on their SaaS spend by eliminating unused tools, consolidating overlapping subscriptions, and negotiating better rates with vendor insights.",
          },
        },
      ],
    },
  ],
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
