import Navbar from '@/components/Layout/Navbar/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { ContextProvider } from '@/context/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SO Helper',
  description: 'Application to help the understanding of S.O by simulation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <ContextProvider>
        <body className={inter.className}>
          <header>
            <Navbar />
          </header>
          {children}
        </body>
      </ContextProvider>
    </html>
  );
}
