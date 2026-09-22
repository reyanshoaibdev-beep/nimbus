'use client'

import { useEffect } from 'react'

export function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-board px-4 py-3 text-white">
          <h2 id="terms-title" className="text-base font-bold sm:text-lg">
            شرائط و ضوابط
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="بند کریں"
            className="rounded-md p-1 text-white/90 hover:bg-white/15"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-4 py-5 text-sm leading-7 text-gray-700">
          <section>
            <h3 className="mb-1.5 text-base font-bold text-board-dark">یہ ویب سائٹ کیسے کام کرتی ہے؟</h3>
            <p>
              Fast Result Getter AI ایک آن لائن نتیجہ چیک کرنے والا پورٹل ہے۔ اس کا مقصد امتحانی
              نتیجہ جاری ہوتے ہی آپ تک تیزی سے پہنچانا ہے۔ اس کا طریقہ کار درج ذیل ہے:
            </p>
            <ol className="mt-2 list-inside list-decimal space-y-1.5">
              <li>آپ اپنا رول نمبر درج کر کے اسے پہلے سے محفوظ (پری بُک) کر سکتے ہیں۔</li>
              <li>نتیجہ جاری ہونے کے مقررہ وقت تک ایک لائیو کاؤنٹ ڈاؤن چلتا رہتا ہے۔</li>
              <li>
                مقررہ وقت پر ہمارا سسٹم متعلقہ تعلیمی بورڈ کے سرکاری ذرائع (API) سے آپ کا نتیجہ
                حاصل کرتا ہے۔
              </li>
              <li>حاصل شدہ نتیجہ صاف ستھری اور آسان اردو انٹرفیس میں آپ کے سامنے پیش کیا جاتا ہے۔</li>
            </ol>
          </section>

          <section>
            <h3 className="mb-1.5 text-base font-bold text-board-dark">اہم معلومات</h3>
            <ul className="list-inside list-disc space-y-1.5">
              <li>
                یہ ایک غیر سرکاری، سہولت فراہم کرنے والا پورٹل ہے۔ نتیجے کی حتمی تصدیق ہمیشہ
                متعلقہ تعلیمی بورڈ سے کریں۔
              </li>
              <li>آپ کا درج کردہ رول نمبر صرف نتیجہ حاصل کرنے کے لیے استعمال ہوتا ہے۔</li>
              <li>ہم کوئی رقم وصول نہیں کرتے؛ ویب سائٹ کا خرچ اشتہارات سے پورا ہوتا ہے۔</li>
            </ul>
          </section>

          <section className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-amber-900">
            <p className="text-[13px] leading-6">
              نوٹ: اگر کسی بھی وجہ سے ہمیں بورڈ کی API سے رابطہ نہ ہو سکے یا نتیجہ تاخیر سے موصول
              ہو، تو نتیجہ نہ بھیجا جا سکتا ہے اور نہ ہی دکھایا جا سکتا ہے۔ ایسی صورت میں براہِ کرم
              کچھ دیر بعد دوبارہ کوشش کریں۔
            </p>
          </section>
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-board px-4 py-3 text-base font-semibold text-white hover:bg-board-dark"
          >
            سمجھ گیا
          </button>
        </div>
      </div>
    </div>
  )
}
