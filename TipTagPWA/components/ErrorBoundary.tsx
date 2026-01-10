'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            發生錯誤
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            {this.state.error?.message || '發生未知錯誤'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            重試
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Wrapper component for async error handling
 */
interface AsyncBoundaryProps {
  children: ReactNode
  loading?: ReactNode
  error?: ReactNode
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
}

export function AsyncBoundary({
  children,
  loading,
  error,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return (
      <>
        {loading || (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
          </div>
        )}
      </>
    )
  }

  if (isError) {
    return (
      <>
        {error || (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-4xl mb-2">❌</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {errorMessage || '載入失敗'}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                重試
              </button>
            )}
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg
        className="text-primary-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  )
}

/**
 * Skeleton loading component
 */
export function Skeleton({
  className = '',
  variant = 'text',
}: {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
}

/**
 * Note list skeleton
 */
export function NoteListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 space-y-2">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-4" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="w-16 h-5 rounded-full" />
            <Skeleton className="w-20 h-5" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Editor skeleton
 */
export function EditorSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-8 h-8" variant="rectangular" />
        ))}
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-5/6 h-4" />
        <Skeleton className="w-4/6 h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  )
}
