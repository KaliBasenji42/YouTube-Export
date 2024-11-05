// Variables and Constants

let showSkipBox = document.getElementById('showSkip');

let trueRandBox = document.getElementById('trueRand');

// Functions

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
  console.log('Popup sent: ' + msg);
  
}

// Events

document.addEventListener('DOMContentLoaded', () => {
  
  send('showSkip req');
  send('trueRand req');
  
})

showSkipBox.addEventListener('input', () => {
  send('showSkip ' + showSkipBox.checked);
})

trueRandBox.addEventListener('input', () => {
  send('trueRand ' + trueRandBox.checked);
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('Popup recived: ' + request.action);
  
  if(request.action === 'showSkip true') showSkipBox.checked = true;
  if(request.action === 'showSkip false') showSkipBox.checked = false;
  
  if(request.action === 'trueRand true') trueRandBox.checked = true;
  if(request.action === 'trueRand false') trueRandBox.checked = false;
  
});
