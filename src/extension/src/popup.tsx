import React, { useState, useEffect } from 'react';
import { listCaptures } from './utils/storage';
import type { CaptureData } from './utils/exportJson';

type CaptureStatus = 'idle' | 'active' | 'capturing';
type View = 'main' | 'history';

/**
 * Popup component for the HTML-to-Figma Chrome Extension.
 * Displays controls for activating the element picker, offline mode toggle,
 * capture history, limitations warnings, and progress feedback.
 */
const Popup: React.FC = () => {
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const [view, setView] = useState<View>('main');
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [captures, setCaptures] = useState<CaptureData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load offline mode preference from chrome.storage on mount
  useEffect(() => {
    chrome.storage.local.get('offlineMode', (result) => {
      if (result['offlineMode'] !== undefined) {
        setOfflineMode(Boolean(result['offlineMode']));
      }
    });
  }, []);

  // Listen for progress and error messages from content script
  useEffect(() => {
    const handler = (message: { type: string; progress?: number; error?: string }): void => {
      if (message.type === 'CAPTURE_PROGRESS' && message.progress !== undefined) {
        setProgress(message.progress);
        if (message.progress >= 100) {
          setStatus('idle');
          setProgress(null);
        }
      }
      if (message.type === 'CAPTURE_ERROR' && message.error) {
        setErrorMsg(message.error);
        setStatus('idle');
        setProgress(null);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  const handleActivate = (): void => {
    setErrorMsg(null);
    const next = status === 'idle' ? 'active' : 'idle';
    setStatus(next);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_PICKER' });
      }
    });
  };

  const handleOfflineToggle = (): void => {
    const next = !offlineMode;
    setOfflineMode(next);
    chrome.storage.local.set({ offlineMode: next });
  };

  const handleShowHistory = async (): Promise<void> => {
    const all = await listCaptures();
    setCaptures(all);
    setView('history');
  };

  const statusLabels: Record<CaptureStatus, string> = {
    idle: 'Inativo',
    active: 'Ativo',
    capturing: 'Capturando',
  };

  if (view === 'history') {
    return (
      <div style={{ width: 320, padding: 16, fontFamily: 'sans-serif' }}>
        <button onClick={() => setView('main')} style={backBtnStyle}>
          ← Voltar
        </button>
        <h2 style={{ fontSize: 14, margin: '8px 0' }}>Histórico de Capturas ({captures.length})</h2>
        {captures.length === 0 ? (
          <p style={{ color: '#666', fontSize: 12 }}>Nenhuma captura ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {captures.map((c) => {
              const rawColor = (c.element?.styles?.['background-color'] as string | undefined) ?? '';
              // Accept only rgb/rgba/hex colors to prevent CSS injection
              const safeColor = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.,\s]+\))$/i.test(rawColor.trim())
                ? rawColor.trim()
                : '#e8e8e8';
              return (
                <li key={c.id} style={historyItemStyle}>
                  {/* Color thumbnail derived from element's background-color */}
                  <div
                    title={safeColor}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: safeColor,
                      border: '1px solid #ddd',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {new URL(c.url).hostname}
                    </div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                      {c.element?.tagName ?? ''} — {new Date(c.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: 320, padding: 16, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 16, margin: '0 0 12px' }}>HTML-to-Figma</h1>

      {/* Status row */}
      <p style={{ margin: '0 0 8px', fontSize: 13 }}>
        Status: <strong>{statusLabels[status]}</strong>
        {offlineMode && (
          <span style={badgeStyle}>🔒 Offline</span>
        )}
      </p>

      {/* Progress bar */}
      {progress !== null && (
        <div style={progressBarContainerStyle}>
          <div style={{ ...progressBarFillStyle, width: `${progress}%` }} />
          <span style={progressLabelStyle}>{progress}%</span>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div style={errorBoxStyle}>{errorMsg}</div>
      )}

      {/* Activate / Deactivate button */}
      <button
        onClick={handleActivate}
        style={{
          ...btnBaseStyle,
          background: status === 'idle' ? '#0075ca' : '#d73a4a',
          marginBottom: 8,
        }}
      >
        {status === 'idle' ? 'Ativar Inspetor' : 'Desativar Inspetor'}
      </button>

      {/* Offline mode toggle */}
      <label style={toggleRowStyle}>
        <input
          type="checkbox"
          checked={offlineMode}
          onChange={handleOfflineToggle}
          style={{ marginRight: 6 }}
        />
        <span style={{ fontSize: 12 }}>Modo Offline (sem servidor)</span>
      </label>

      {/* History link */}
      <button onClick={handleShowHistory} style={linkBtnStyle}>
        Ver Histórico de Capturas
      </button>

      {/* Limitations warning */}
      <details style={{ marginTop: 12 }}>
        <summary style={{ fontSize: 11, color: '#666', cursor: 'pointer' }}>
          ⚠️ Limitações conhecidas
        </summary>
        <ul style={{ fontSize: 11, color: '#888', paddingLeft: 16, margin: '6px 0 0' }}>
          <li>Shadow DOM / Web Components não suportado.</li>
          <li>Media queries não capturadas (apenas viewport atual).</li>
          <li>Imagens cross-origin podem não carregar no Figma (CORS).</li>
          <li>Variable fonts, gradientes e blend modes não suportados.</li>
          <li>Máximo de 100 elementos por captura.</li>
        </ul>
      </details>
    </div>
  );
};

/* ── Shared styles ─────────────────────────────────────── */

const btnBaseStyle: React.CSSProperties = {
  padding: '8px 16px',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  width: '100%',
  fontSize: 13,
};

const backBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#0075ca',
  cursor: 'pointer',
  padding: 0,
  fontSize: 12,
};

const linkBtnStyle: React.CSSProperties = {
  display: 'block',
  background: 'none',
  border: 'none',
  color: '#0075ca',
  fontSize: 12,
  cursor: 'pointer',
  padding: '4px 0',
  textAlign: 'center',
  width: '100%',
};

const badgeStyle: React.CSSProperties = {
  marginLeft: 8,
  background: '#e8f4fd',
  color: '#0075ca',
  borderRadius: 10,
  padding: '1px 6px',
  fontSize: 11,
};

const progressBarContainerStyle: React.CSSProperties = {
  position: 'relative',
  height: 16,
  background: '#eee',
  borderRadius: 8,
  overflow: 'hidden',
  marginBottom: 8,
};

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  background: '#0075ca',
  transition: 'width 0.2s ease',
};

const progressLabelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: 10,
  lineHeight: '16px',
  color: '#333',
};

const toggleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 4,
  cursor: 'pointer',
};

const errorBoxStyle: React.CSSProperties = {
  background: '#fff0f0',
  border: '1px solid #d73a4a',
  borderRadius: 4,
  padding: '6px 8px',
  fontSize: 11,
  color: '#d73a4a',
  marginBottom: 8,
};

const historyItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 4px',
  borderBottom: '1px solid #eee',
  gap: 8,
};

export default Popup;
