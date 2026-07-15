import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { siteConfig } from '../config/site.config';
import { AppProvider } from '../shared/providers/AppProvider';
import { Navbar } from '../shared/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t p-4 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} KIZUNAFIT. All rights reserved.
            </footer>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
