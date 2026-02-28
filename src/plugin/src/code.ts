
type ImportMessage = {
  type: 'IMPORT_JSON';
  json: string;
  lightweight?: boolean;
};

type ImportReport = {
  totalElements: number;
  fontsSubstituted: Array<{ original: string; replacement: string }>;
  corsWarnings: string[];
  errors: string[];
};

const uiHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML-to-Figma Importer</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
        color: #1e1e1e;
        padding: 16px;
        background: #fff;
        width: 360px;
      }
      h1 { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
      textarea {
        width: 100%;
        height: 120px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        font-size: 11px;
        font-family: monospace;
        resize: vertical;
        outline: none;
        margin-bottom: 8px;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }
      .row label { display: flex; align-items: center; gap: 4px; cursor: pointer; }
      #import-btn {
        flex: 1;
        background: #0075ca;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      #progress {
        display: none;
        margin-bottom: 8px;
        color: #666;
      }
      #error {
        display: none;
        background: #fff0f0;
        border: 1px solid #d73a4a;
        border-radius: 4px;
        padding: 8px;
        color: #d73a4a;
        font-size: 11px;
        margin-bottom: 8px;
      }
      #report {
        display: none;
        background: #f6fff6;
        border: 1px solid #2ea44f;
        border-radius: 4px;
        padding: 8px;
        font-size: 11px;
        line-height: 1.5;
      }
      #report ul { padding-left: 16px; margin-top: 4px; }
    </style>
  </head>
  <body>
    <h1>HTML-to-Figma — Importar</h1>
    <textarea id="json-input" placeholder="Cole aqui o JSON gerado pela extensão Chrome…"></textarea>
    <div class="row">
      <label>
        <input type="checkbox" id="lightweight" />
        Modo Lightweight (apenas estrutura)
      </label>
      <button id="import-btn">Importar</button>
    </div>
    <div id="progress"></div>
    <div id="error"></div>
    <div id="report"></div>

    <script>
      const textarea = document.getElementById('json-input');
      const importBtn = document.getElementById('import-btn');
      const lightweightChk = document.getElementById('lightweight');
      const progress = document.getElementById('progress');
      const error = document.getElementById('error');
      const report = document.getElementById('report');

      function showError(msg) {
        error.textContent = msg;
        error.style.display = 'block';
        report.style.display = 'none';
      }

      function clearError() {
        error.style.display = 'none';
      }

      function setProgress(percent) {
        if (percent > 0 && percent < 100) {
          progress.style.display = 'block';
          progress.textContent = 'Processando: ' + percent + '%';
        } else {
          progress.style.display = 'none';
        }
      }

      importBtn.addEventListener('click', () => {
        const json = textarea.value || '';
        if (!json.trim()) {
          showError('Cole um JSON válido antes de importar.');
          return;
        }
        clearError();
        setProgress(10);
        parent.postMessage({
          pluginMessage: {
            type: 'IMPORT_JSON',
            json,
            lightweight: lightweightChk.checked
          }
        }, '*');
      });

      window.onmessage = (event) => {
        const msg = event.data.pluginMessage;
        if (!msg) return;

        if (msg.type === 'PROGRESS') {
          setProgress(msg.percent || 0);
          return;
        }

        if (msg.type === 'IMPORT_ERROR') {
          setProgress(0);
          showError(msg.message || 'Erro desconhecido.');
          return;
        }

        if (msg.type === 'IMPORT_SUCCESS') {
          setProgress(0);
          const r = msg.report;
          let html = '<strong>✅ Importação concluída</strong><br>';
          html += (r.totalElements || 0) + ' elemento(s) processado(s).<br>';
          if (r.errors && r.errors.length) {
            html += '<br><strong>❌ Erros:</strong><ul>';
            r.errors.forEach((e) => {
              html += '<li>' + e + '</li>';
            });
            html += '</ul>';
          }
          report.innerHTML = html;
          report.style.display = 'block';
          error.style.display = 'none';
        }
      };
    </script>
  </body>
</html>`;

function countElements(value: unknown): number {
  if (!value || typeof value !== 'object') {
    return 0;
  }

  const node = value as Record<string, unknown>;
  const children = Array.isArray(node['children']) ? (node['children'] as unknown[]) : [];
  return 1 + children.reduce<number>((acc, child) => acc + countElements(child), 0);
}

function toImportReport(rawJson: string): ImportReport {
  const parsed = JSON.parse(rawJson) as Record<string, unknown>;
  const element = parsed['element'];
  const totalElements = countElements(element);

  return {
    totalElements,
    fontsSubstituted: [],
    corsWarnings: [],
    errors: totalElements === 0 ? ['Nenhum elemento encontrado no campo element.'] : [],
  };
}

async function createSummaryNode(report: ImportReport, lightweight: boolean): Promise<void> {
  const frame = figma.createFrame();
  frame.name = lightweight ? 'HTML Import (Lightweight)' : 'HTML Import';
  frame.resize(420, 140);
  frame.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.98, b: 1 } }];
  frame.cornerRadius = 8;

  const title = figma.createText();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  title.characters = 'HTML-to-Figma: importação da POC';
  title.fontSize = 16;
  title.x = 16;
  title.y = 16;

  const subtitle = figma.createText();
  subtitle.characters = `Elementos processados: ${report.totalElements}`;
  subtitle.fontSize = 12;
  subtitle.x = 16;
  subtitle.y = 48;

  frame.appendChild(title);
  frame.appendChild(subtitle);

  figma.currentPage.appendChild(frame);
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
}

figma.showUI(uiHtml, { width: 390, height: 420 });

figma.ui.onmessage = async (msg: ImportMessage): Promise<void> => {
  if (!msg || msg.type !== 'IMPORT_JSON') {
    return;
  }

  try {
    figma.ui.postMessage({ type: 'PROGRESS', percent: 35 });
    const report = toImportReport(msg.json);
    figma.ui.postMessage({ type: 'PROGRESS', percent: 75 });
    await createSummaryNode(report, Boolean(msg.lightweight));
    figma.ui.postMessage({ type: 'IMPORT_SUCCESS', report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao importar JSON.';
    figma.ui.postMessage({ type: 'IMPORT_ERROR', message });
  }
};
