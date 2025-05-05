// Variables and Constants

let trueRandBox = document.getElementById('trueRand');
let exportBttn = document.getElementById('export');
let progress = document.getElementById('progress');
let download = document.getElementById('download');

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
  else if(request.action === 'popup trueRand false') trueRandBox.checked = false;
  else if(request.action.slice(0, 'script progress '.length) === 'script progress ') {
    progress.innerText = request.action.slice('script progress '.length);
  }
  else if(request.action.slice(0, 'popup download '.length) === 'popup download ') {
    download.href = request.action.slice('popup progress '.length);
    download.click();
  }
});
