import { useEffect } from 'react'

/**
 * shortcuts: [{ key, fn, ctrl?, shift? }]
 *  key: string  ex: 'F9', 'F10', 'p', '1' ... '5'
 */
export default function useKeyboardShortcut(shortcuts) {
  useEffect(() => {
    function handler(e) {
      // Ignora quando digitando em um input/textarea
      const tag = e.target?.tagName?.toLowerCase()
      const isEditing = tag === 'input' || tag === 'textarea' || tag === 'select'

      shortcuts.forEach(({ key, fn, ctrl = false, shift = false, allowInput = false }) => {
        if (isEditing && !allowInput) return
        if (ctrl  && !e.ctrlKey)  return
        if (shift && !e.shiftKey) return
        if (e.key === key) {
          e.preventDefault()
          fn()
        }
      })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}
