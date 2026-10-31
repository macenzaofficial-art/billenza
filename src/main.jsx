import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import SubscriptionGuard from './components/SubscriptionGuard.jsx'
import { restorePrefs, startMirroring } from './utils/prefsMirror'
import './index.css'

let __updateSW = null;
window.__fgsbSwUpdateReady = false;

const hasUnsavedInput = () => {
  try {
    const inputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');
    for (const el of inputs) {
      if (el.value && String(el.value).trim().length > 0) return true;
      if (el.getAttribute?.('contenteditable') === 'true' && el.textContent?.trim().length > 0) return true;
    }
    return false;
  } catch { return false; }
};

__updateSW = registerSW({
  onNeedRefresh() {
    window.__fgsbSwUpdateReady = true;
    window.dispatchEvent(new CustomEvent('fgsb-sw-update-ready'));
    if (!hasUnsavedInput()) {
      setTimeout(() => window.__fgsbApplyUpdate?.(), 500);
      return;
    }
    setTimeout(() => window.__fgsbApplyUpdate?.(), 20_000);
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('fgsb-sw-offline-ready'));
  },
});

window.__fgsbApplyUpdate = () => {
  if (!window.__fgsbSwUpdateReady) return;
  window.__fgsbSwUpdateReady = false;
  if (__updateSW) __updateSW(true);
};

window.addEventListener('blur', () => {
  if (window.__fgsbSwUpdateReady) window.__fgsbApplyUpdate();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(reg => {
    if (!reg) return;
    if (reg.waiting) {
      try {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } catch { /* ignore */ }
    }
    let alreadyReloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (alreadyReloaded) return;
      alreadyReloaded = true;
      window.location.reload();
    });
  }).catch(() => { /* not registered yet */ });

  let chunkReloadFired = false;
  window.addEventListener('error', (e) => {
    const msg = String(e?.message || e?.error?.message || '');
    if (!chunkReloadFired && /dynamically imported module|Loading chunk|Failed to fetch dynamically/i.test(msg)) {
      chunkReloadFired = true;
      setTimeout(() => window.location.reload(), 200);
    }
  });
  window.addEventListener('unhandledrejection', (e) => {
    const msg = String(e?.reason?.message || e?.reason || '');
    if (!chunkReloadFired && /dynamically imported module|Loading chunk|Failed to fetch dynamically/i.test(msg)) {
      chunkReloadFired = true;
      setTimeout(() => window.location.reload(), 200);
    }
  });
}

restorePrefs().then((restored) => {
  startMirroring(restored)
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <SubscriptionGuard>
        <App />
      </SubscriptionGuard>
    </StrictMode>,
  )
})
