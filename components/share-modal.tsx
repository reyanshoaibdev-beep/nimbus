'use client'

import { useEffect, useState } from 'react'
import { toUrduDigits } from '@/lib/format'

// Interaction-driven progress steps. Each WhatsApp-share interaction advances
// one step. NOTE: this is only an interaction/unlock indicator — it does NOT
// verify that the user actually shared with anyone.
const STEPS = [0, 35, 48, 67, 88, 100]

type Variant = 'prebook' | 'unlock'

const COPY: Record<
  Variant,
  {
    title: string
    body: string
    subtext: string
    done: string
    doneButton: string
  }
> = {
  prebook: {
    title: 'اپنا نتیجہ سب سے پہلے حاصل کرنے کے لیے یہ صفحہ اپنے دوستوں کے ساتھ شیئر کریں۔',
    body: 'واٹس ایپ پر شیئر کریں اور اپنی پیش رفت مکمل کریں۔',
    subtext: '',
    done: 'آپ کا نتیجہ 8:45 بجے جاری ہوتے ہی آپ کو دکھایا جائے گا۔',
    doneButton: 'ٹھیک ہے',
  },
  unlock: {
    title: 'آپ کا نتیجہ تیار ہے۔',
    body: 'مکمل نتیجہ دیکھنے کے لیے اسے اپنے دوستوں کے ساتھ شیئر کریں۔',
    subtext: 'واٹس ایپ پر شیئر کریں اور اپنی پیش رفت مکمل کریں۔',
    done: 'شکریہ! آپ کا مکمل نتیجہ ظاہر کیا جا رہا ہے۔',
    doneButton: 'مکمل نتیجہ دیکھیں',
  },
}

const SHARE_MESSAGE =
  'اپنا امتحانی نتیجہ یہاں سے دیکھیں۔ نتیجہ جاری ہوتے ہی سب سے پہلے حاصل کریں:'

export function ShareModal({
  open,
  variant,
  onClose,
  onComplete,
}: {
  open: boolean
  variant: Variant
  onClose: () => void
  onComplete: () => void
}) {
  const [step, setStep] = useState(0)
  const copy = COPY[variant]
  const progress = STEPS[step]
  const complete = progress >= 100

  // Reset the interaction progress every time the modal is (re)opened so that
  // each new session/student starts from 0%.
  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  if (!open) return null

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      const text = `${SHARE_MESSAGE} ${url}`
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const handleDone = () => {
    onComplete()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="w-full max-w-md rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl">
        <div className="mb-1 flex items-center justify-between">
          <div className="h-1.5 w-10 rounded bg-board" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
            aria-label="بند کریں"
          >
            &times;
          </button>
        </div>

        <h2 className="mt-2 text-base font-semibold leading-7 text-gray-900">{copy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">{copy.body}</p>
        {copy.subtext ? <p className="mt-1 text-sm leading-6 text-gray-600">{copy.subtext}</p> : null}

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>پیش رفت</span>
            <span className="urdu-digits">{toUrduDigits(progress)}٪</span>
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-board transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {complete ? (
          <div className="mt-5">
            <div className="rounded-md border border-board/30 bg-board-tint px-4 py-3 text-center text-sm font-medium leading-7 text-board-dark">
              {copy.done}
            </div>
            <button
              type="button"
              onClick={handleDone}
              className="mt-4 w-full rounded-md bg-board px-4 py-3 text-base font-semibold text-white hover:bg-board-dark"
            >
              {copy.doneButton}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleShare}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-base font-semibold text-white hover:bg-[#1da851]"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
            </svg>
            واٹس ایپ پر شیئر کریں
          </button>
        )}
      </div>
    </div>
  )
}
