import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Billenza ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', fontFamily: 'sans-serif',
        }}>
          <div style={{
            background: '#fff', borderRadius: 18, border: '1px solid #fee2e2',
            padding: '2.5rem', maxWidth: 500, width: '100%', textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: '#fee2e2',
              color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <AlertTriangle size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d1d1d', margin: '0 0 8px' }}>
              Something went wrong loading this view
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '0.65rem 1.25rem', borderRadius: 999, background: '#1d1d1d',
                  color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} /> Reload Page
              </button>
              {this.props.onReset && (
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.onReset();
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '0.65rem 1.25rem', borderRadius: 999, background: '#f1f5f9',
                    color: '#334155', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  }}
                >
                  <Home size={14} /> Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
