import { useState, useEffect, useRef } from 'react';
import { background, swell } from 'asciify-engine/kit';
import { signInWithEmail, signUpWithEmail, signInWithMagicLink } from '../services/authService';
import { Zap, Mail, Lock, Building, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AuthModal({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [plan, setPlan] = useState('pro_monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const backdropRef = useRef(null);
  const modalCardRef = useRef(null);
  const submitButtonRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      const planParam = params.get('plan');
      if (modeParam === 'signup' || modeParam === 'register') {
        setMode('signup');
      } else if (modeParam === 'login' || modeParam === 'signin') {
        setMode('login');
      }
      if (planParam) {
        setPlan(planParam.includes('year') ? 'pro_yearly' : 'pro_monthly');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Initialize and clean up Asciify Swell background behind AuthModal
  useEffect(() => {
    if (!backdropRef.current) return;

    let bg = null;
    try {
      bg = background(backdropRef.current, {
        preset: swell,
        palette: '#DCF986',
        speed: 0.8,
        cellSize: 14,
        opacity: 0.85,
        mark: 'dot',
        cursor: 'lantern',
        look: {
          clear: false,
          highlight: '#F3FED0',
        },
      });
      bgRef.current = bg;
    } catch (err) {
      console.warn('Asciify background initialization skipped or failed:', err);
    }

    return () => {
      if (bg) {
        try {
          bg.destroy();
        } catch (err) {
          console.warn('Asciify background cleanup error:', err);
        }
        bgRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (bgRef.current?.field?.pulse) {
        bgRef.current.field.pulse({ element: submitButtonRef.current || modalCardRef.current });
      }
    } catch {
      // Pulse animation flourish
    }

    try {
      if (mode === 'magic') {
        await signInWithMagicLink(email);
        setMessage('Check your inbox! We sent you a secure login link.');
      } else if (mode === 'signup') {
        const data = await signUpWithEmail(email, password, businessName, plan);
        if (data.session) {
          if (onAuthSuccess) await onAuthSuccess(data.user);
        } else {
          setMessage('Account created! Please sign in with your email and password.');
          setMode('login');
        }
      } else {
        const data = await signInWithEmail(email, password);
        if (data.session && onAuthSuccess) {
          await onAuthSuccess(data.user);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#080c16',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        overflowY: 'auto',
      }}
    >
      <div
        ref={modalCardRef}
        style={{
          position: 'relative', zIndex: 1,
          background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(220, 249, 134, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
        }}
      >
        {/* Header with Billenza Brand */}
        <div style={{ padding: '2rem 2rem 1.25rem', textAlign: 'center', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: '#1d1d1d',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.75rem',
          }}>
            <Zap size={24} fill="#DCF986" stroke="#1D1D1D" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1d1d1d', margin: 0, fontFamily: 'sans-serif' }}>
            Billenza Cloud
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: 4, marginBottom: 0 }}>
            {mode === 'login' && 'Sign in to access your GST billing workspace'}
            {mode === 'signup' && 'Create your Billenza business account'}
            {mode === 'magic' && 'Passwordless instant sign-in via email link'}
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', background: '#fff' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setMessage(null); }}
            style={{
              flex: 1, padding: '0.85rem 0.5rem', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              color: mode === 'login' ? '#1d1d1d' : '#888',
              borderBottom: mode === 'login' ? '2px solid #1d1d1d' : '2px solid transparent',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
            style={{
              flex: 1, padding: '0.85rem 0.5rem', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              color: mode === 'signup' ? '#1d1d1d' : '#888',
              borderBottom: mode === 'signup' ? '2px solid #1d1d1d' : '2px solid transparent',
            }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('magic'); setError(null); setMessage(null); }}
            style={{
              flex: 1, padding: '0.85rem 0.5rem', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              color: mode === 'magic' ? '#1d1d1d' : '#888',
              borderBottom: mode === 'magic' ? '2px solid #1d1d1d' : '2px solid transparent',
            }}
          >
            Magic Link
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem 2rem' }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1rem',
              borderRadius: 10, background: '#fee2e2', color: '#991b1b',
              fontSize: '0.85rem', marginBottom: '1.25rem',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1rem',
              borderRadius: 10, background: '#dcfce7', color: '#166534',
              fontSize: '0.85rem', marginBottom: '1.25rem',
            }}>
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: 10,
                border: '1px solid #e2e8f0', marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Selected Plan:
                </div>
                <div style={{
                  background: '#DCF986', color: '#1D1D1D', fontSize: '0.75rem',
                  fontWeight: 700, padding: '3px 8px', borderRadius: 6
                }}>
                  {plan === 'pro_yearly' ? 'Annual Pro (₹4,999/yr)' : 'Monthly Pro (₹499/mo)'}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: 6 }}>
                  Business or Trading Name
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Solutions"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      borderRadius: 10, border: '1px solid #ddd', fontSize: '0.9rem',
                      boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="email"
                required
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                  borderRadius: 10, border: '1px solid #ddd', fontSize: '0.9rem',
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
            </div>
          </div>

          {mode !== 'magic' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    borderRadius: 10, border: '1px solid #ddd', fontSize: '0.9rem',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          <button
            ref={submitButtonRef}
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.8rem', borderRadius: 999, border: 'none',
              background: '#1d1d1d', color: '#fff', fontSize: '0.95rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, transition: 'all 0.2s',
            }}
          >
            {loading ? 'Processing...' : (
              <>
                {mode === 'login' && 'Sign In to Workspace'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'magic' && 'Send Login Link'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
