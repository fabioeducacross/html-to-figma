/**
 * Content Script for HTML-to-Figma Chrome Extension.
 * Handles element picking with visual overlay and captures element data.
 */

import { sanitizeElement } from './utils/domPurify';
import { saveCapture } from './utils/storage';
import { generateCaptureJSON, type CaptureData } from './utils/exportJson';

let isPickerActive = false;
let overlay: HTMLDivElement | null = null;

/** Creates a visual highlight overlay for the hovered element. */
function createOverlay(): HTMLDivElement {
  const el = document.createElement('div');
  el.id = '__html2figma_overlay__';
  el.style.cssText = `
    position: fixed;
    pointer-events: none;
    background: rgba(0, 117, 202, 0.2);
    border: 2px solid #0075ca;
    box-sizing: border-box;
    z-index: 2147483647;
    transition: all 0.1s ease;
  `;
  document.body.appendChild(el);
  return el;
}

/** Positions the overlay over the given element's bounding box. */
function positionOverlay(target: Element): void {
  if (!overlay) return;
  const rect = target.getBoundingClientRect();
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

/** Handles mouseover: highlight the element under the cursor. */
function onMouseOver(event: MouseEvent): void {
  if (!isPickerActive) return;
  const target = event.target as Element;
  if (target.id === '__html2figma_overlay__') return;
  positionOverlay(target);
}

/** Handles click: capture the clicked element. */
async function onClick(event: MouseEvent): Promise<void> {
  if (!isPickerActive) return;
  event.preventDefault();
  event.stopPropagation();

  const target = event.target as Element;
  if (target.id === '__html2figma_overlay__') return;

  const sanitized = sanitizeElement(target);
  const captureData: CaptureData = generateCaptureJSON(sanitized, target);
  await saveCapture(captureData);

  chrome.runtime.sendMessage({ type: 'CAPTURE_COMPLETE', data: captureData });
  deactivatePicker();
}

/** Handles Escape key: deactivate picker. */
function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') deactivatePicker();
}

/** Activates the element picker. */
function activatePicker(): void {
  isPickerActive = true;
  overlay = createOverlay();
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
}

/** Deactivates the element picker and removes overlay. */
function deactivatePicker(): void {
  isPickerActive = false;
  overlay?.remove();
  overlay = null;
  document.removeEventListener('mouseover', onMouseOver);
  document.removeEventListener('click', onClick);
  document.removeEventListener('keydown', onKeyDown);
}

/** Listens for messages from the popup. */
chrome.runtime.onMessage.addListener((message: { type: string }) => {
  if (message.type === 'TOGGLE_PICKER') {
    if (isPickerActive) {
      deactivatePicker();
    } else {
      activatePicker();
    }
  }
});
