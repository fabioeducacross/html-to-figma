import React, { useState } from 'react';

type CaptureStatus = 'idle' | 'active' | 'capturing';

/**
 * Popup component for the HTML-to-Figma Chrome Extension.
 * Displays controls for activating the element picker and accessing capture history.
 */
const Popup: React.FC = () => {
  const [status, setStatus] = useState<CaptureStatus>('idle');

  const handleActivate = (): void => {
    setStatus(status === 'idle' ? 'active' : 'idle');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_PICKER' });
      }
    });
  };

  const statusLabels: Record<CaptureStatus, string> = {
    idle: 'Inativo',
    active: 'Ativo',
    capturing: 'Capturando',
  };

  return (
    <div style={{ width: 300, padding: 16, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 16, marginBottom: 12 }}>HTML-to-Figma</h1>
      <p style={{ marginBottom: 8 }}>
        Status: <strong>{statusLabels[status]}</strong>
      </p>
      <button
        onClick={handleActivate}
        style={{
          padding: '8px 16px',
          background: status === 'idle' ? '#0075ca' : '#d73a4a',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginBottom: 8,
          width: '100%',
        }}
      >
        {status === 'idle' ? 'Ativar Inspetor' : 'Desativar Inspetor'}
      </button>
      <a
        href="history.html"
        style={{ display: 'block', textAlign: 'center', color: '#0075ca', fontSize: 12 }}
      >
        Ver Histórico de Capturas
      </a>
    </div>
  );
};

export default Popup;
