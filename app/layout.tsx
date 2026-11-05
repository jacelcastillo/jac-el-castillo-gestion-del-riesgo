import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { siteConfig } from '@/config/site'
import { AppShell } from '@/components/templates/app-shell'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin', 'latin-ext'],
})

const atkinson = Atkinson_Hyperlegible_Next({
  variable: '--font-atkinson',
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.organization}` },
  description: siteConfig.description,
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: siteConfig.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#10131f' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.locale} suppressHydrationWarning className={`${bricolage.variable} ${atkinson.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
