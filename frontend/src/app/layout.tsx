import { ThemeProvider } from '@/components/home/theme-provider';
import { siteConfig } from '@/lib/site';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});



const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Yari - AI Agents for Small Businesses',
  description:
    'Deploy AI agents for small businesses in seconds. Automate tasks, build tools, and boost productivity with powerful AI assistants.',
  keywords: [
    'AI agents for small businesses',
    'small business automation',
    'AI assistants',
    'business productivity',
    'automated workflows',
    'AI tools for SMB',
    'business AI agents',
    'small business AI',
    'productivity automation',
    'AI task automation',
  ],
  authors: [{ name: 'Yaritech Team', url: 'https://yaritech.ai' }],
      creator:
      'Yaritech Team - Adam Cohen Hillel, Marko Kraemer, Domenico Gagliardi, and Quoc Dat Le',
      publisher:
      'Yaritech Team - Adam Cohen Hillel, Marko Kraemer, Domenico Gagliardi, and Quoc Dat Le',
  category: 'Technology',
  applicationName: 'Yari',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Yari - AI Agents for Small Businesses',
    description:
      'Deploy AI agents for small businesses in seconds. Automate tasks, build tools, and boost productivity with powerful AI assistants.',
    url: siteConfig.url,
    siteName: 'Yari',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Yari - AI Agents for Small Businesses',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yari - AI Agents for Small Businesses',
    description:
      'Deploy AI agents for small businesses in seconds. Automate tasks, build tools, and boost productivity with powerful AI assistants.',
    creator: '@yaritechai',
    site: '@yaritechai',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Yari - AI Agents for Small Businesses',
      },
    ],
  },
  icons: {
    icon: [
      { url: 'https://rd9rzh3qxh.ufs.sh/f/NUZrLWPd7wqS8q3nT4H0u2mQZfzoDwFiTjAaNkBehOYKdIX1', type: 'image/png' },
      { url: 'https://rd9rzh3qxh.ufs.sh/f/NUZrLWPd7wqS8q3nT4H0u2mQZfzoDwFiTjAaNkBehOYKdIX1', type: 'image/png', sizes: '32x32' }
    ],
    shortcut: 'https://rd9rzh3qxh.ufs.sh/f/NUZrLWPd7wqS8q3nT4H0u2mQZfzoDwFiTjAaNkBehOYKdIX1',
    apple: { url: 'https://rd9rzh3qxh.ufs.sh/f/NUZrLWPd7wqS8q3nT4H0u2mQZfzoDwFiTjAaNkBehOYKdIX1', sizes: 'any' }
  },
  // manifest: "/manifest.json",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PCHSN4M2');`}
        </Script>
        {/* End Google Tag Manager */}

      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-base-100 text-base-content`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCHSN4M2"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Providers>
            <ReactQueryProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ReactQueryProvider>
          </Providers>
          <GoogleAnalytics gaId="G-6ETJFB3PT3" />
        </ThemeProvider>
      </body>
    </html>
  );
}
