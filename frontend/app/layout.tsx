import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: `${site.fullName}`,
  description: site.description
};

const themeScript = `(() => {
  try {
    const stored = window.localStorage.getItem('wial-theme');
    const theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
