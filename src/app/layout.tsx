import '@/styles/globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import { fontMono, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import ConvexClientProvider from '@/providers/convex-client-provider';

export const metadata: Metadata = {
  title: 'Chat PDF Now | Chat with your PDF documents',
  description: 'Chat with your PDF documents',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(
              'min-h-svh overscroll-none font-sans antialiased',
              fontSans.variable,
              fontMono.variable,
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
