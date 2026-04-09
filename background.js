let isActive = false;

chrome.action.onClicked.addListener(async (tab) => {
  isActive = !isActive;
  
  // Send message to content script
  try {
    await chrome.tabs.sendMessage(tab.id, { 
      action: isActive ? "enable" : "disable" 
    });
    
    // Update extension icon badge
    if (isActive) {
      chrome.action.setBadgeText({ text: "ON", tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: "#00AA00", tabId: tab.id });
    } else {
      chrome.action.setBadgeText({ text: "", tabId: tab.id });
    }
  } catch (error) {
    console.log("Could not send message:", error);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "disable") {
    isActive = false;
    if (sender.tab) {
      chrome.action.setBadgeText({ text: "", tabId: sender.tab.id });
    }
  }
});