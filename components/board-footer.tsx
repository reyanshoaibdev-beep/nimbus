import { SMART_LINK } from '@/lib/ads'

export function BoardFooter() {
  return (
    <footer className="mt-8 border-t border-gray-200 bg-board-tint">
      <div className="mx-auto max-w-3xl px-4 py-5 text-center text-xs leading-6 text-gray-600">
        <p>یہ ایک آزمائشی نتیجہ پورٹل ہے۔ نتائج کی حتمی تصدیق متعلقہ تعلیمی بورڈ سے کریں۔</p>
        <p className="mt-1">© تمام حقوق محفوظ ہیں۔</p>
        <a
          href={SMART_LINK.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-medium text-board underline underline-offset-2"
        >
          مزید آفسز دیکھیں
        </a>
      </div>
    </footer>
  )
}
