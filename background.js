// Variables

let showSkip = false;

let trueRand = false;

let URLs = [];
let PLData = {};
let PLName = '';

// Function

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({active: true}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
  console.log('Background sent: ' + msg);
  
}

// Events

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('Background recived: ' + request.action);
  
  if(request.action === 'showSkip req') send('showSkip ' + showSkip);
  if(request.action === 'showSkip true') showSkip = true;
  if(request.action === 'showSkip false') showSkip = false;
  
  if(request.action === 'trueRand req') send('trueRand ' + trueRand);
  if(request.action === 'trueRand true') trueRand = true;
  if(request.action === 'trueRand false') trueRand = false;
  
});
