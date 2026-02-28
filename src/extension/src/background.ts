/**
 * Background service worker for HTML-to-Figma Chrome Extension.
 * Handles communication between popup and content scripts.
 */

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CAPTURE_COMPLETE') {
    // Notify popup that capture is done
    chrome.runtime.sendMessage({ type: 'CAPTURE_DONE', data: message.data });
    sendResponse({ ok: true });
  }
  return true;
});
