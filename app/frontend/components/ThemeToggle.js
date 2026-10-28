'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        background: 'transparent',
        border: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      <img
        src={theme === 'dark' ? '/light.png' : '/dark.png'}
        alt="Toggle theme"
        width={24}
        height={24}
        style={{
          display: 'block',
          background: 'transparent',
        }}
      />
    </button>
  )
}
