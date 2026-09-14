import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { Analytics } from "@/components/layout/analytics";
import { siteConfig } from "@/lib/site";
import { publicEnv } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.shortTitle,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.shortTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.shortTitle,
    description: siteConfig.description,
    ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
  },
  verification: publicEnv.googleSiteVerification ? { google: publicEnv.googleSiteVerification } : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** JSON-LD structured data – Person + ProfessionalService + WebSite */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      url: siteConfig.url,
      jobTitle: "Full-Stack Web Developer & WordPress Developer",
      description: siteConfig.description,
      knowsAbout: [
        "WordPress Development",
        "Elementor",
        "WooCommerce",
        "Full-Stack Web Development",
        "UI/UX Design",
        "React",
        "Next.js",
        "Framer",
        "Webflow",
        "SEO",
        "Landing Pages",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#service`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      provider: { "@id": `${siteConfig.url}/#person` },
      serviceType: [
        "WordPress Development",
        "Web Design",
        "UI/UX Design",
        "WooCommerce Development",
        "Landing Page Design",
        "SEO Optimization",
        "Performance Optimization",
        "Framer Development",
        "Webflow Development",
      ],
      areaServed: "Worldwide",
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      author: { "@id": `${siteConfig.url}/#person` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
