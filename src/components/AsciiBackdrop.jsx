import { useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { background, swell } from 'asciify-engine/kit';

const AsciiContext = createContext({
  triggerPulse: () => {},
  bg: null,
});

export const useAsciiBackground = () => useContext(AsciiContext);

export const ASCII_BACKGROUND_CONFIG = {
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
};

export const asciiModalCardStyle = {
  position: 'relative',
  zIndex: 1,
  background: '#fff',
  borderRadius: 24,
  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(220, 249, 134, 0.18)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  overflow: 'hidden',
};

export default function AsciiBackdrop({
  children,
  bgRef: externalBgRef,
  style = {},
  className = '',
}) {
  const backdropRef = useRef(null);
  const internalBgRef = useRef(null);
  const bgRef = externalBgRef || internalBgRef;

  useEffect(() => {
    if (!backdropRef.current) return;

    let bg = null;
    try {
      bg = background(backdropRef.current, ASCII_BACKGROUND_CONFIG);
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
  }, [bgRef]);

  const triggerPulse = useCallback((target) => {
    try {
      const element = target?.current || target;
      if (bgRef.current?.field?.pulse && element) {
        bgRef.current.field.pulse({ element });
      }
    } catch {
      // Pulse animation flourish
    }
  }, [bgRef]);

  const contextValue = {
    triggerPulse,
    get bg() {
      return bgRef.current;
    },
  };

  return (
    <AsciiContext.Provider value={contextValue}>
      <div
        ref={backdropRef}
        className={className}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: '#080c16',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          overflowY: 'auto',
          fontFamily: 'sans-serif',
          ...style,
        }}
      >
        {typeof children === 'function' ? children(contextValue) : children}
      </div>
    </AsciiContext.Provider>
  );
}
