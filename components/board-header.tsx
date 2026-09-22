import Link from 'next/link'

export function BoardHeader() {
  return (
    <header className="bg-board text-white">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-board-dark font-nastaliq text-lg leading-none"
        >
          ب
        </div>
        <div className="min-w-0">
          <Link href="/" className="block">
            <h1 className="font-nastaliq text-base leading-tight sm:text-lg">
              بورڈ آف انٹرمیڈیٹ اینڈ سیکنڈری ایجوکیشن
            </h1>
            <p className="text-xs text-white/80 sm:text-sm">امتحانی نتائج پورٹل</p>
          </Link>
        </div>
      </div>
      <div className="h-1 w-full bg-board-dark" />
    </header>
  )
}
