'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  getAllNotes,
  getAllCategories,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  saveNotes,
  Note,
  Category
} from '@/utils/db'

export interface UseNotesReturn {
  notes: Note[]
  categories: Category[]
  selectedNote: Note | null
  isLoading: boolean
  error: string | null
  // Actions
  setSelectedNote: (note: Note | null) => void
  handleCreateNote: (category?: string) => Promise<Note>
  handleUpdateNote: (id: string, updates: Partial<Note>) => Promise<Note | null>
  handleDeleteNote: (id: string) => Promise<boolean>
  handleTogglePin: (note: Note) => Promise<void>
  handleSearch: (query: string) => Promise<void>
  handleCategoryFilter: (categoryId: string | null) => Promise<void>
  refreshNotes: () => Promise<void>
  mergeNotes: (pulledNotes: Note[]) => Promise<void>
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFilter, setCurrentFilter] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [loadedNotes, loadedCategories] = await Promise.all([
        getAllNotes(),
        getAllCategories()
      ])
      setNotes(loadedNotes)
      setCategories(loadedCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入資料失敗')
      console.error('Failed to load data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCreateNote = useCallback(async (category?: string): Promise<Note> => {
    const newNote = await createNote({
      title: '新筆記',
      content: '',
      htmlContent: '',
      category: category || currentFilter || 'general',
      tags: [],
      isPinned: false,
      isArchived: false,
    })
    setNotes(prev => [newNote, ...prev])
    setSelectedNote(newNote)
    return newNote
  }, [currentFilter])

  const handleUpdateNote = useCallback(async (
    id: string,
    updates: Partial<Note>
  ): Promise<Note | null> => {
    const updated = await updateNote(id, updates)
    if (updated) {
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
      if (selectedNote?.id === id) {
        setSelectedNote(updated)
      }
    }
    return updated
  }, [selectedNote])

  const handleDeleteNote = useCallback(async (id: string): Promise<boolean> => {
    await deleteNote(id)
    setNotes(prev => prev.filter(n => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
    return true
  }, [selectedNote])

  const handleTogglePin = useCallback(async (note: Note) => {
    const updated = await updateNote(note.id, { isPinned: !note.isPinned })
    if (updated) {
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      const results = await searchNotes(query)
      setNotes(results)
    } else {
      const allNotes = await getAllNotes()
      setNotes(allNotes)
    }
  }, [])

  const handleCategoryFilter = useCallback(async (categoryId: string | null) => {
    setCurrentFilter(categoryId)
    const allNotes = await getAllNotes()
    if (categoryId) {
      setNotes(allNotes.filter(n => n.category === categoryId))
    } else {
      setNotes(allNotes)
    }
  }, [])

  const mergeNotes = useCallback(async (pulledNotes: Note[]) => {
    const currentNotes = await getAllNotes()
    const mergedMap = new Map<string, Note>()

    currentNotes.forEach(n => mergedMap.set(n.id, n))
    pulledNotes.forEach(n => mergedMap.set(n.id, n))

    const mergedNotes = Array.from(mergedMap.values())
      .sort((a, b) => b.updatedAt - a.updatedAt)

    await saveNotes(mergedNotes)
    setNotes(mergedNotes)

    if (mergedNotes.length > 0 && !selectedNote) {
      setSelectedNote(mergedNotes[0])
    }
  }, [selectedNote])

  return {
    notes,
    categories,
    selectedNote,
    isLoading,
    error,
    setSelectedNote,
    handleCreateNote,
    handleUpdateNote,
    handleDeleteNote,
    handleTogglePin,
    handleSearch,
    handleCategoryFilter,
    refreshNotes: loadData,
    mergeNotes,
  }
}
