let active = false;
let tooltip = null;
let lastHighlighted = null;

// Create tooltip element
function createTooltip() {
  const div = document.createElement('div');
  div.id = "element-id-finder-tooltip";
  // Apply styles directly - make sure text is visible
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

// Get element info - simplified and debugged
function getElementInfo(element) {
  // Get the ID
  const id = element.id;
  const tagName = element.tagName.toLowerCase();
  
  // Build display text
  let displayText = "";
  
  if (id && id !== "") {
    displayText = `<${tagName} id="${id}">`;
  } else {
    displayText = `<${tagName}> (no id)`;
  }
  
  // Also log to console for debugging
  console.log("[ID Finder]", displayText);
  
  return displayText;
}

// Mouse move handler
function onMouseMove(e) {
  if (!active) return;
  
  const element = e.target;
  const displayText = getElementInfo(element);
  
  if (tooltip) {
    tooltip.textContent = displayText;  // Use textContent, not innerHTML
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

// Click handler to copy ID
function onClick(e) {
  if (!active) return;
  
  const element = e.target;
  if (element.id && element.id !== "") {
    // Copy to clipboard
    navigator.clipboard.writeText(element.id).then(() => {
      // Show confirmation
      const confirmMsg = document.createElement('div');
      confirmMsg.textContent = `✓ Copied: "${element.id}"`;
      confirmMsg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 8px 14px;
        border-radius: 6px;
        font-family: monospace;
        z-index: 999999;
        font-size: 13px;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(confirmMsg);
      setTimeout(() => confirmMsg.remove(), 1500);
    }).catch(err => {
      console.log("Copy failed:", err);
    });
    
    // Prevent the click from doing its normal action while inspecting
    e.preventDefault();
    e.stopPropagation();
  } else {
    // Show temporary message that element has no ID
    const noIdMsg = document.createElement('div');
    noIdMsg.textContent = `✗ No ID on this <${element.tagName.toLowerCase()}>`;
    noIdMsg.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #e74c3c;
      color: white;
      padding: 8px 14px;
      border-radius: 6px;
      font-family: monospace;
      z-index: 999999;
      font-size: 13px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(noIdMsg);
    setTimeout(() => noIdMsg.remove(), 1000);
  }
}

// Enable the inspector
function enable() {
  if (active) {
    console.log("[ID Finder] Already active");
    return;
  }
  active = true;
  console.log("[ID Finder] ENABLED - Hover over elements to see their IDs");
  tooltip = createTooltip();
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick, true);
}

// Disable the inspector
function disable() {
  if (!active) return;
  active = false;
  console.log("[ID Finder] DISABLED");
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
  if (lastHighlighted) {
    lastHighlighted.style.outline = "";
    lastHighlighted = null;
  }
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('click', onClick, true);
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[ID Finder] Message received:", message);
  if (message.action === "enable") {
    enable();
  } else if (message.action === "disable") {
    disable();
  }
});

// Also listen for keyboard shortcut ESC to disable
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && active) {
    disable();
    // Also tell background to update its state
    chrome.runtime.sendMessage({ action: "disable" });
  }
});