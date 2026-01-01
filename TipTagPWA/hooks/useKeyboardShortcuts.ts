'use client'

import { useEffect, useCallback, useRef } from 'react'

type KeyHandler = (event: KeyboardEvent) => void

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  handler: KeyHandler
  description?: string
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  preventDefault?: boolean
}

/**
 * Hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea (unless it's the editor)
      const target = event.target as HTMLElement
      const isEditable = target.tagName === 'INPUT' ||
                         target.tagName === 'TEXTAREA' ||
                         target.isContentEditable

      for (const shortcut of shortcutsRef.current) {
        const ctrlOrMeta = shortcut.ctrl || shortcut.meta
        const ctrlPressed = event.ctrlKey || event.metaKey

        const matches =
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (ctrlOrMeta ? ctrlPressed : !ctrlPressed) &&
          (shortcut.shift ? event.shiftKey : !event.shiftKey) &&
          (shortcut.alt ? event.altKey : !event.altKey)

        if (matches) {
          // Allow shortcuts with modifiers in editable elements
          if (isEditable && !ctrlOrMeta && !shortcut.alt) {
            continue
          }

          if (preventDefault) {
            event.preventDefault()
          }
          shortcut.handler(event)
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, preventDefault])

  return {
    shortcuts: shortcuts.map(s => ({
      key: s.key,
      modifiers: [
        s.ctrl && 'Ctrl',
        s.meta && 'Cmd',
        s.shift && 'Shift',
        s.alt && 'Alt',
      ].filter(Boolean).join('+'),
      description: s.description,
    })),
  }
}

/**
 * Predefined shortcuts for TipTag
 */
export function useTipTagShortcuts(handlers: {
  onNewNote?: () => void
  onSearch?: () => void
  onSave?: () => void
  onToggleSidebar?: () => void
  onToggleTheme?: () => void
  onOpenTemplates?: () => void
  onOpenSettings?: () => void
  onSync?: () => void
}) {
  const shortcuts: ShortcutConfig[] = []

  if (handlers.onNewNote) {
    shortcuts.push({
      key: 'n',
      ctrl: true,
      handler: handlers.onNewNote,
      description: '新增筆記',
    })
  }

  if (handlers.onSearch) {
    shortcuts.push({
      key: 'k',
      ctrl: true,
      handler: handlers.onSearch,
      description: '搜尋',
    })
    shortcuts.push({
      key: 'f',
      ctrl: true,
      handler: handlers.onSearch,
      description: '搜尋',
    })
  }

  if (handlers.onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      handler: handlers.onSave,
      description: '儲存',
    })
  }

  if (handlers.onToggleSidebar) {
    shortcuts.push({
      key: 'b',
      ctrl: true,
      handler: handlers.onToggleSidebar,
      description: '切換側邊欄',
    })
  }

  if (handlers.onToggleTheme) {
    shortcuts.push({
      key: 'd',
      ctrl: true,
      shift: true,
      handler: handlers.onToggleTheme,
      description: '切換深淺模式',
    })
  }

  if (handlers.onOpenTemplates) {
    shortcuts.push({
      key: 't',
      ctrl: true,
      handler: handlers.onOpenTemplates,
      description: '開啟模板',
    })
  }

  if (handlers.onOpenSettings) {
    shortcuts.push({
      key: ',',
      ctrl: true,
      handler: handlers.onOpenSettings,
      description: '開啟設定',
    })
  }

  if (handlers.onSync) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      shift: true,
      handler: handlers.onSync,
      description: 'GitHub 同步',
    })
  }

  return useKeyboardShortcuts(shortcuts)
}
