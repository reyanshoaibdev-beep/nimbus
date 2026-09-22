'use client'

import { BANNER_ADS, buildBannerSrcDoc, isPlaceholder, type BannerSize } from '@/lib/ads'

function BannerFrame({ size }: { size: BannerSize }) {
  const ad = BANNER_ADS[size]
  return (
    <iframe
      title="اشتہار"
      aria-label="اشتہار"
      width={ad.width}
      height={ad.height}
      srcDoc={buildBannerSrcDoc(ad)}
      scrolling="no"
      className="block border-0"
      style={{ width: ad.width, height: ad.height }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  )
}

/**
 * Responsive horizontal banner: 728x90 on desktop, 320x50 on mobile.
 * While a banner still holds its placeholder key, a neutral filler is shown
 * instead of a broken/empty ad frame.
 */
export function AdSlot({
  label = 'اشتہار',
  desktopSize = '728x90',
  mobileSize = '320x50',
}: {
  label?: string
  desktopSize?: BannerSize
  mobileSize?: BannerSize
}) {
  const ready = !isPlaceholder(BANNER_ADS[desktopSize].key) || !isPlaceholder(BANNER_ADS[mobileSize].key)

  if (!ready) {
    return (
      <div
        role="complementary"
        aria-label="اشتہاری جگہ"
        className="flex min-h-24 w-full items-center justify-center border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center"
      >
        <span className="text-xs tracking-wide text-gray-400">{label}</span>
      </div>
    )
  }

  return (
    <div role="complementary" aria-label="اشتہاری جگہ" className="flex w-full justify-center py-2">
      <div className="hidden sm:block">
        <BannerFrame size={desktopSize} />
      </div>
      <div className="block sm:hidden">
        <BannerFrame size={mobileSize} />
      </div>
    </div>
  )
}
