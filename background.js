// Variables

let showSkip = false;

// Function

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
}

// Events

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('background recived: ' + request.action);
  
  if(request.action === 'showSkip req') send('showSkip ' + showSkip);
  if(request.action === 'showSkip true') showSkip = true;
  if(request.action === 'showSkip false') showSkip = false;
  
});
