import './globals.css';

export const metadata = {
  title: 'RFQ Automation — Chemveda',
  description: 'AI-powered pharmaceutical RFQ automation tool. Parse vendor emails, extract structured chemical procurement data, and export to Excel — all in your browser.',
  keywords: 'RFQ, automation, pharmaceutical, chemical procurement, Chemveda',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
