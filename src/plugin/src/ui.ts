/**
 * Figma Plugin UI — HTML-to-Figma Converter
 * Import interface: textarea paste + drag-and-drop JSON upload + conversion report.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImportReport {
  totalElements: number;
  fontsSubstituted: { original: string; replacement: string }[];
  corsWarnings: string[];
  errors: string[];
}

// ── State ─────────────────────────────────────────────────────────────────────

let report: ImportReport | null = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const textarea = document.getElementById('json-input') as HTMLTextAreaElement;
const dropzone = document.getElementById('dropzone') as HTMLDivElement;
const importBtn = document.getElementById('import-btn') as HTMLButtonElement;
const lightweightChk = document.getElementById('lightweight') as HTMLInputElement;
const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
const progressLabel = document.getElementById('progress-label') as HTMLSpanElement;
const errorBox = document.getElementById('error-box') as HTMLDivElement;
const reportBox = document.getElementById('report-box') as HTMLDivElement;

// ── Helpers ───────────────────────────────────────────────────────────────────

function showError(msg: string): void {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  reportBox.style.display = 'none';
}

function clearError(): void {
  errorBox.style.display = 'none';
}

function setProgress(percent: number): void {
  progressBar.style.display = 'block';
  progressFill.style.width = `${percent}%`;
  progressLabel.textContent = `${percent}%`;
  if (percent >= 100) {
    setTimeout(() => {
      progressBar.style.display = 'none';
    }, 800);
  }
}

function renderReport(r: ImportReport): void {
  let html = `<strong>✅ Importação concluída</strong><br>`;
  html += `${r.totalElements} elemento(s) importado(s).<br>`;
  if (r.fontsSubstituted.length > 0) {
    html += `<br><strong>⚠️ Fontes substituídas (${r.fontsSubstituted.length}):</strong><ul>`;
    r.fontsSubstituted.forEach((f) => {
      html += `<li>${f.original} → ${f.replacement}</li>`;
    });
    html += '</ul>';
  }
  if (r.corsWarnings.length > 0) {
    html += `<br><strong>🌐 Possíveis problemas de CORS (${r.corsWarnings.length}):</strong><ul>`;
    r.corsWarnings.forEach((w) => {
      html += `<li style="word-break:break-all">${w}</li>`;
    });
    html += '</ul>';
  }
  if (r.errors.length > 0) {
    html += `<br><strong>❌ Erros (${r.errors.length}):</strong><ul>`;
    r.errors.forEach((e) => {
      html += `<li>${e}</li>`;
    });
    html += '</ul>';
  }
  reportBox.innerHTML = html;
  reportBox.style.display = 'block';
}

function loadJSON(jsonStr: string): void {
  clearError();
  report = null;
  reportBox.style.display = 'none';

  if (!jsonStr.trim()) {
    showError('Cole ou arraste um arquivo JSON de captura.');
    return;
  }

  const lightweight = lightweightChk.checked;
  setProgress(10);

  parent.postMessage(
    {
      pluginMessage: {
        type: 'IMPORT_JSON',
        json: jsonStr,
        lightweight,
      },
    },
    '*'
  );
}

// ── Event listeners ───────────────────────────────────────────────────────────

importBtn.addEventListener('click', () => {
  loadJSON(textarea.value);
});

// Drag-and-drop support
dropzone.addEventListener('dragover', (e): void => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', (): void => {
  dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e): void => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  const file = e.dataTransfer?.files[0];
  if (!file) return;
  if (!file.name.endsWith('.json')) {
    showError('Somente arquivos .json são aceitos.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (): void => {
    const text = reader.result as string;
    textarea.value = text;
    loadJSON(text);
  };
  reader.readAsText(file);
});

// Click-to-upload fallback inside dropzone
dropzone.addEventListener('click', (): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (): void => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (): void => {
      const text = reader.result as string;
      textarea.value = text;
      loadJSON(text);
    };
    reader.readAsText(file);
  };
  input.click();
});

// ── Messages from plugin code.ts ──────────────────────────────────────────────

window.onmessage = (event: MessageEvent): void => {
  const msg = event.data.pluginMessage as
    | { type: 'PROGRESS'; percent: number }
    | { type: 'IMPORT_SUCCESS'; report: ImportReport }
    | { type: 'IMPORT_ERROR'; message: string }
    | undefined;

  if (!msg) return;

  switch (msg.type) {
    case 'PROGRESS':
      setProgress(msg.percent);
      break;
    case 'IMPORT_SUCCESS':
      setProgress(100);
      report = msg.report;
      renderReport(report);
      break;
    case 'IMPORT_ERROR':
      setProgress(0);
      progressBar.style.display = 'none';
      showError(msg.message);
      break;
  }
};
