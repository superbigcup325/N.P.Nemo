import React, { type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#e0e0e0'
        }}>
          <h2 style={{ marginBottom: 16 }}>Something went wrong</h2>
          <p style={{ color: '#888', marginBottom: 24 }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 24px',
              backgroundColor: '#4a4a6a',
              border: 'none',
              borderRadius: 4,
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
