import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Naskh_Arabic, Noto_Nastaliq_Urdu } from 'next/font/google'
import { NATIVE_BANNER, POPUNDER, SOCIAL_BAR } from '@/lib/ads'
import './globals.css'

const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naskh',
  display: 'swap',
})

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-nastaliq',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'بورڈ نتیجہ پورٹل | امتحانی نتیجہ',
  description:
    'انٹرمیڈیٹ اور سیکنڈری امتحانات کا نتیجہ آن لائن دیکھیں۔ اپنا رول نمبر درج کریں اور اپنا نتیجہ حاصل کریں۔',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0b5d1e',
  width: 'device-width',
  initialScale: 1,
}

function GlobalAdScripts() {
  return (
    <>
      <script async data-cfasync="false" src={NATIVE_BANNER.src} />
      <div id={NATIVE_BANNER.containerId} />
      <script src={POPUNDER.src} />
      <script src={SOCIAL_BAR.src} />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ur" dir="rtl" className={`${naskh.variable} ${nastaliq.variable}`}>
      <body className="font-naskh antialiased">
        <GlobalAdScripts />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
