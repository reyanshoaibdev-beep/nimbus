'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BoardHeader } from '@/components/board-header'
import { BoardFooter } from '@/components/board-footer'
import { AdSlot } from '@/components/ad-slot'
import { useRelease } from '@/hooks/use-release'

const YEARS = ['2025', '2024', '2023', '2022']

function SearchForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { released } = useRelease()

  const [roll, setRoll] = useState('')
  const [year, setYear] = useState('2025')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const prefill = params.get('roll')
    if (prefill) setRoll(prefill.replace(/[^\d]/g, ''))
  }, [params])

  const handleSubmit = async () => {
    setError('')
    const value = roll.trim()

    if (!/^\d{4,10}$/.test(value)) {
      setError('درج کیا گیا رول نمبر درست نہیں ہے۔')
      return
    }

    if (!released) {
      setError('نتیجہ ابھی جاری نہیں ہوا۔ براہِ کرم 8:45 بجے کے بعد دوبارہ کوشش کریں۔')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: value, examYear: year }),
      })
      const data = await res.json()

      if (data.status === 'ok') {
        router.push(`/result?roll=${encodeURIComponent(value)}&year=${encodeURIComponent(year)}`)
        return
      }
      if (data.status === 'invalid') {
        setError('درج کیا گیا رول نمبر درست نہیں ہے۔')
      } else if (data.status === 'not_found') {
        setError('اس رول نمبر کا نتیجہ نہیں ملا۔')
      } else if (data.status === 'not_released') {
        setError('نتیجہ ابھی جاری نہیں ہوا۔ براہِ کرم 8:45 بجے کے بعد دوبارہ کوشش کریں۔')
      } else {
        setError('نتیجہ حاصل کرنے میں مسئلہ پیش آیا، براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔')
      }
    } catch {
      setError('نتیجہ حاصل کرنے میں مسئلہ پیش آیا، براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <div className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-board-tint px-4 py-3">
          <h2 className="text-lg font-bold text-board-dark">اپنا نتیجہ دیکھیں</h2>
        </div>

        <div className="px-4 py-5">
          <label htmlFor="roll" className="mb-1.5 block text-sm font-semibold text-gray-800">
            رول نمبر
          </label>
          <input
            id="roll"
            inputMode="numeric"
            autoComplete="off"
            placeholder="رول نمبر درج کریں"
            value={roll}
            onChange={(e) => {
              setRoll(e.target.value.replace(/[^\d]/g, ''))
              if (error) setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit()
            }}
            className="urdu-digits w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-lg tracking-wide outline-none focus:border-board focus:ring-2 focus:ring-board/30"
            dir="ltr"
          />

          <label htmlFor="year" className="mb-1.5 mt-4 block text-sm font-semibold text-gray-800">
            امتحانی سال
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="urdu-digits w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-lg outline-none focus:border-board focus:ring-2 focus:ring-board/30"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {error ? (
            <p role="alert" className="mt-3 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full rounded-md bg-board px-4 py-3 text-base font-semibold text-white hover:bg-board-dark disabled:opacity-60"
          >
            {loading ? 'انتظار کریں…' : 'نتیجہ دیکھیں'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <BoardHeader />
      <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-6 text-gray-500">لوڈ ہو رہا ہے…</div>}>
        <SearchForm />
      </Suspense>
      <section className="mx-auto max-w-3xl px-4 pb-2">
        <AdSlot />
      </section>
      <BoardFooter />
    </main>
  )
}
