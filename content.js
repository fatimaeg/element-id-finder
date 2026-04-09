let active = false;
let tooltip = null;
let lastHighlighted = null;

// Create tooltip element
function createTooltip() {
  const div = document.createElement('div');
  div.id = "element-id-finder-tooltip";
  div.style.position = "fixed";
  div.style.backgroundColor = "#000000";
  div.style.color = "#00ff00";
  div.style.fontFamily = "monospace";
  div.style.fontSize = "13px";
  div.style.fontWeight = "bold";
  div.style.padding = "6px 10px";
  div.style.borderRadius = "4px";
  div.style.zIndex = "999999";
  div.style.pointerEvents = "none";
  div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
  div.style.border = "1px solid #00ff00";
  div.style.whiteSpace = "nowrap";
  div.style.display = "none";
  document.body.appendChild(div);
  return div;
}

// Get element info
// Get element info - NOW WITH TYPE DETECTION
function getElementInfo(element) {
  const id = element.id;
  const tagName = element.tagName.toLowerCase();
  let typeInfo = "";
  
  // Check if it's an input, button, or form element that can have a type
  if (element.type && typeof element.type === 'string') {
    // For input, button, textarea, select elements
    const inputType = element.type.toLowerCase();
    typeInfo = ` type="${inputType}"`;
  } else if (tagName === 'textarea') {
    typeInfo = ` type="textarea"`;
  } else if (tagName === 'select') {
    typeInfo = ` type="select"`;
  } else if (tagName === 'button') {
    // Buttons can have type="submit", "button", "reset"
    if (element.type && element.type !== '') {
      typeInfo = ` type="${element.type}"`;
    } else {
      typeInfo = ` type="button"`; // default button type
    }
  }
  
  // Build display text
  let displayText = "";
  
  if (id && id !== "") {
    if (typeInfo) {
      displayText = `<${tagName}${typeInfo} id="${id}">`;
    } else {
      displayText = `<${tagName} id="${id}">`;
    }
  } else {
    if (typeInfo) {
      displayText = `<${tagName}${typeInfo}> (no id)`;
    } else {
      displayText = `<${tagName}> (no id)`;
    }
  }
  
  // Log to console for debugging
  console.log("[ID Finder]", displayText);
  
  return displayText;
}

// Copy text to clipboard (works on all modern browsers)
async function copyToClipboard(text) {
  try {
    // Method 1: Modern clipboard API
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Method 2: Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackErr) {
      console.error('Copy failed:', fallbackErr);
      return false;
    }
  }
}

// Show temporary message
function showMessage(text, isError = false) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${isError ? '#e74c3c' : '#2ecc71'};
    color: white;
    padding: 8px 14px;
    border-radius: 6px;
    font-family: monospace;
    z-index: 999999;
    font-size: 13px;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}

// Mouse move handler
function onMouseMove(e) {
  if (!active) return;
  
  const element = e.target;
  const displayText = getElementInfo(element);
  
  if (tooltip) {
    tooltip.textContent = displayText;
    tooltip.style.display = "block";
    tooltip.style.left = (e.clientX + 15) + "px";
    tooltip.style.top = (e.clientY + 15) + "px";
  }
  
  // Highlight the element
  if (lastHighlighted) {
    lastHighlighted.style.outline = "";
  }
  element.style.outline = "2px solid #ff00ff";
  element.style.outlineOffset = "2px";
  lastHighlighted = element;
}

// Click handler - THIS IS WHERE COPY HAPPENS
async function onClick(e) {
  if (!active) return;
  
  const element = e.target;
  const elementId = element.id;
  
  if (elementId && elementId !== "") {
    // Try to copy the ID
    const copySuccess = await copyToClipboard(elementId);
    
    if (copySuccess) {
      showMessage(`✅ Copied: "${elementId}"`);
      console.log(`[ID Finder] Copied ID: ${elementId}`);
    } else {
      showMessage(`❌ Failed to copy: "${elementId}"`, true);
    }
  } else {
    showMessage(`⚠️ No ID on <${element.tagName.toLowerCase()}>`, true);
  }
  
  // Don't prevent default or stop propagation - let the page work normally
  // This was the problem before - it was blocking copy on some sites
}

// Enable the inspector
function enable() {
  if (active) return;
  active = true;
  console.log("[ID Finder] ✅ ENABLED - Hover to see IDs, Click to copy");
  tooltip = createTooltip();
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick);
}

// Disable the inspector
function disable() {
  if (!active) return;
  active = false;
  console.log("[ID Finder] ❌ DISABLED");
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
  if (lastHighlighted) {
    lastHighlighted.style.outline = "";
    lastHighlighted = null;
  }
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('click', onClick);
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enable") {
    enable();
  } else if (message.action === "disable") {
    disable();
  }
});

// ESC key to disable
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && active) {
    disable();
    chrome.runtime.sendMessage({ action: "disable" });
  }
});