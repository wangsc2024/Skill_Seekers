'use client'

import { memo, useCallback, useMemo } from 'react'
import { Note, Category } from '@/utils/db'

interface NoteListProps {
  notes: Note[]
  categories: Category[]
  selectedNoteId: string | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
  onTogglePin: (note: Note) => void
}

export const NoteList = memo(function NoteList({
  notes,
  categories,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
}: NoteListProps) {
  // Sort notes: pinned first, then by updated date
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  }, [notes])

  const getCategoryById = useCallback(
    (id: string) => categories.find(c => c.id === id),
    [categories]
  )

  if (sortedNotes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-4xl mb-2">📝</p>
        <p>沒有筆記</p>
        <p className="text-sm mt-1">點擊「新增」開始</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {sortedNotes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          category={getCategoryById(note.category)}
          isSelected={selectedNoteId === note.id}
          onSelect={onSelectNote}
          onDelete={onDeleteNote}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  )
})

interface NoteItemProps {
  note: Note
  category: Category | undefined
  isSelected: boolean
  onSelect: (note: Note) => void
  onDelete: (noteId: string) => void
  onTogglePin: (note: Note) => void
}

const NoteItem = memo(function NoteItem({
  note,
  category,
  isSelected,
  onSelect,
  onDelete,
  onTogglePin,
}: NoteItemProps) {
  const handleSelect = useCallback(() => {
    onSelect(note)
  }, [note, onSelect])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('確定要刪除這個筆記嗎？')) {
      onDelete(note.id)
    }
  }, [note.id, onDelete])

  const handleTogglePin = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onTogglePin(note)
  }, [note, onTogglePin])

  // Extract preview text from HTML
  const previewText = useMemo(() => {
    return note.htmlContent.replace(/<[^>]*>/g, '').slice(0, 100) || '空白筆記'
  }, [note.htmlContent])

  // Format date
  const formattedDate = useMemo(() => {
    return new Date(note.updatedAt).toLocaleDateString('zh-TW')
  }, [note.updatedAt])

  return (
    <div
      onClick={handleSelect}
      className={`
        p-4 cursor-pointer transition-colors
        hover:bg-gray-50 dark:hover:bg-gray-700
        ${isSelected ? 'bg-primary-50 dark:bg-primary-900/30' : ''}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSelect()
        }
      }}
      aria-selected={isSelected}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {note.isPinned && (
              <span title="已釘選" aria-label="已釘選">📌</span>
            )}
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {note.title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {previewText}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: (category?.color || '#6b7280') + '20',
                color: category?.color || '#6b7280'
              }}
            >
              {category?.icon || '📁'} {category?.name || '未分類'}
            </span>
            <span className="text-xs text-gray-400">
              {formattedDate}
            </span>
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={handleTogglePin}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title={note.isPinned ? '取消釘選' : '釘選'}
            aria-label={note.isPinned ? '取消釘選' : '釘選'}
          >
            {note.isPinned ? '📌' : '📍'}
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 transition-colors"
            title="刪除"
            aria-label="刪除筆記"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
})
