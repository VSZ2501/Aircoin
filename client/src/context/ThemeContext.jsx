/**
 * Emplacement : client/src/context/ThemeContext.jsx
 *
 * Mode nuit — v1 simple.
 * Pilote la classe "dark" sur <html>, ce qui active toutes les
 * classes Tailwind dark:xxx du site (voir @custom-variant dans
 * global.css). Préférence persistée dans localStorage.
 *
 * Usage :
 *   const { isDark, toggleTheme } = useTheme()
 */

import { createContext, useContext, useState, useEffect } from 'react'

const THEME_KEY = 'aircoin_theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'dark'
  })

  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  function toggleTheme() {
    setIsDark((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de <ThemeProvider>')
  }
  return ctx
}