import "./globals.css";

export const metadata = {
  title: {
    default: "Belly Bliss | World's Healthiest Superfoods",
    template: "%s | Belly Bliss"
  },
  description: "Your ultimate guide to the most nutrient-dense foods on Earth for longevity and health.",
  metadataBase: new URL('https://bellybliss.vercel.app'),
  openGraph: {
    title: "Belly Bliss | World's Healthiest Superfoods",
    description: "Your ultimate guide to the most nutrient-dense foods on Earth for longevity and health.",
    url: 'https://bellybliss.vercel.app',
    siteName: 'Belly Bliss',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Belly Bliss | World's Healthiest Superfoods",
    description: "Your ultimate guide to the most nutrient-dense foods on Earth for longevity and health.",
  },
};

export default function RootLayout({ children }) {
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
