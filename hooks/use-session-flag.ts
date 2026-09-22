'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * A boolean flag backed by sessionStorage, so it survives navigation between
 * result sections but resets for a new browsing session / new student.
 */
export function useSessionFlag(key: string): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState(false)

  useEffect(() => {
    try {
      setValue(window.sessionStorage.getItem(key) === '1')
    } catch {
      // ignore storage access errors
    }
  }, [key])

  const update = useCallback(
    (next: boolean) => {
      setValue(next)
      try {
        if (next) window.sessionStorage.setItem(key, '1')
        else window.sessionStorage.removeItem(key)
      } catch {
        // ignore storage access errors
      }
    },
    [key],
  )

  return [value, update]
}
