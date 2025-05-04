// Variables and Constants

let trueRandBox = document.getElementById('trueRand');

let exportBttn = document.getElementById('export');

// Functions

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({active: true}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
  console.log('Popup sent: ' + msg);
  
}

// Events

document.addEventListener('DOMContentLoaded', () => {
  
  send('popup trueRand req');
  
});

trueRandBox.addEventListener('input', () => {
  send('popup trueRand ' + trueRandBox.checked);
});

exportBttn.addEventListener('click', () => {
  send('popup export');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('Popup recived: ' + request.action);
  
  if(request.action === 'popup trueRand true') trueRandBox.checked = true;
  if(request.action === 'popup trueRand false') trueRandBox.checked = false;
  
});
