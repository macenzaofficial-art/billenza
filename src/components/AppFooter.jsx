import { Zap } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer style={{
      marginTop: 'auto', paddingTop: '1.5rem',
      textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center',
        padding: '0.35rem 0.95rem', borderRadius: 999, background: 'var(--card-bg)', border: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}>
        <Zap size={12} style={{ color: '#22c55e', fill: '#22c55e' }} />
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Billenza Cloud</span>
        <span aria-hidden="true">·</span>
        <span>© 2026 Billenza Inc.</span>
        <span aria-hidden="true">·</span>
        <span style={{ color: '#22c55e', fontWeight: 600 }}>Active Subscription</span>
      </span>
    </footer>
  );
}
