import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { SupabaseProvider } from '@/providers/supabase-provider';
import { DataProvider } from '@/context/DataContext';
import Footer from '@/components/Footer';
import Header from '@/components/header';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Cloudy Unicorn',
  description: 'The fastest way to grow your social media engagement.',
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.className} antialiased`} suppressHydrationWarning>
      <SupabaseProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              <DataProvider>
                {children}
              </DataProvider>
            </main>
          </ThemeProvider>
        </body>
      </SupabaseProvider>
    </html>
  );
}
