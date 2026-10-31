import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { getUserSubscription, signOut } from '../services/authService';
import AuthModal from './AuthModal';
import AsciiBackdrop, { asciiModalCardStyle } from './AsciiBackdrop';
import { ShieldAlert, Zap, LogOut, RefreshCw, ExternalLink, ArrowRight } from 'lucide-react';

function SubscriptionPaywall({ session, checkingSub, onVerify, onSignOut }) {
  const cardRef = useRef(null);
  const refreshBtnRef = useRef(null);
  const bgRef = useRef(null);

  const handleRefresh = async () => {
    try {
      if (bgRef.current?.field?.pulse) {
        bgRef.current.field.pulse({ element: refreshBtnRef.current || cardRef.current });
      }
    } catch {
      // Pulse animation flourish
    }
    await onVerify();
  };

  const marketingUrl = import.meta.env.VITE_MARKETING_URL || 'http://localhost:3000';

  return (
    <AsciiBackdrop bgRef={bgRef}>
      <div
        ref={cardRef}
        style={{
          ...asciiModalCardStyle,
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <div style={{ padding: '2.5rem 2rem 1.5rem', background: '#fafafa', borderBottom: '1px solid #eee' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#fee2e2',
            color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1d1d1d', margin: '0 0 6px' }}>
            Active Subscription Required
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
            Signed in as <strong>{session.user.email}</strong>. This workspace requires an active Billenza subscription.
          </p>
        </div>

        {/* Pricing Action */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16,
            padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
              Ready to activate your workspace?
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
              Choose between Monthly Pro (₹499/mo) or Annual Pro (₹4,999/yr) on our main billing site to immediately unlock full access.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Redirect to Marketing Site Pricing Button */}
            <a
              href={`${marketingUrl}/#pricing`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '0.9rem', borderRadius: 999, background: '#1d1d1d', color: '#fff',
                fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              }}
            >
              Choose a Plan on Billenza.com
              <ExternalLink size={16} />
            </a>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                ref={refreshBtnRef}
                type="button"
                onClick={handleRefresh}
                disabled={checkingSub}
                style={{
                  flex: 1, padding: '0.7rem', borderRadius: 999, border: '1px solid #cbd5e1',
                  background: '#fff', color: '#334155', fontWeight: 600, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <RefreshCw size={14} className={checkingSub ? 'animate-spin' : ''} />
                {checkingSub ? 'Checking...' : 'Refresh Status'}
              </button>

              <button
                type="button"
                onClick={onSignOut}
                style={{
                  padding: '0.7rem 1.25rem', borderRadius: 999, border: '1px solid #fee2e2',
                  background: '#fff5f5', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </AsciiBackdrop>
  );
}

export default function SubscriptionGuard({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [subscription, setSubscription] = useState(null);
  const [subChecked, setSubChecked] = useState(false);
  const [checkingSub, setCheckingSub] = useState(false);
  const verifyingRef = useRef(null);

  const verifySubscription = async (userId) => {
    if (!userId) {
      setSubChecked(true);
      return null;
    }

    if (verifyingRef.current) {
      return verifyingRef.current;
    }

    setCheckingSub(true);
    const promise = (async () => {
      try {
        const sub = await getUserSubscription(userId);
        setSubscription(sub);
        return sub;
      } catch (err) {
        console.error('Subscription verification failed:', err);
        return null;
      } finally {
        setCheckingSub(false);
        setSubChecked(true);
        setLoading(false);
        verifyingRef.current = null;
      }
    })();

    verifyingRef.current = promise;
    return promise;
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        verifySubscription(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        verifySubscription(newSession.user.id);
      } else {
        setSubscription(null);
        setSubChecked(false);
        setLoading(false);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // If Supabase credentials are not configured, run in standalone mode (local dev/tests)
  if (!isSupabaseConfigured()) {
    return children;
  }

  // Initial loading state
  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#080c16',
        fontFamily: 'sans-serif', gap: 16,
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14, background: '#1d1d1d',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 35px rgba(220, 249, 134, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Zap size={26} fill="#DCF986" stroke="#1D1D1D" />
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f3fed0' }}>
          Initializing Billenza Workspace...
        </div>
      </div>
    );
  }

  // If unauthenticated or subscription check hasn't finished yet for a newly logged in user:
  if (!session || !subChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c16' }}>
        <AuthModal onAuthSuccess={(user) => verifySubscription(user.id)} />
      </div>
    );
  }

  // Check if subscription is active
  const isActive = subscription?.subscription_status === 'active';

  // If authenticated but without an active subscription, display the Paywall Barrier with Ascii background
  if (!isActive) {
    return (
      <SubscriptionPaywall
        session={session}
        checkingSub={checkingSub}
        onVerify={() => verifySubscription(session.user.id)}
        onSignOut={() => signOut()}
      />
    );
  }

  // Active subscriber!
  return children;
}
