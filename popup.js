// Variables and Constants

let trueRandBox = document.getElementById('trueRand');
let exportBttn = document.getElementById('export');
let expProgress = document.getElementById('expProgress');
let expDownload = document.getElementById('expDownload');

// Functions

function send(toAddr, msgSub, msgVal) {
  // toAddr: String, to which script
  // msgSub: String, message subject
  // msgVal: message value
  
  let msg = {to: toAddr, from: 'popup', sub: msgSub, val: msgVal};
  
  if(toAddr == 'background') chrome.runtime.sendMessage(msg);
  
  if(toAddr == 'script') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
  
  console.log(msg);
  
}

// Events

document.addEventListener('DOMContentLoaded', () => {
  send('background', 'trueRand', 'req');
  send('background', 'expDownload', 'req');
});

trueRandBox.addEventListener('input', () => {
  send('background', 'trueRand', trueRandBox.checked);
});

exportBttn.addEventListener('click', () => {
  send('script', 'export', '');
});

expDownload.addEventListener('click', function(event) {
  if(expDownload.href.slice(0, 'chrome-extension://'.length) == 'chrome-extension://') event.preventDefault();
});

chrome.runtime.onMessage.addListener((request) => {
  
  console.log(request);
  
  if(request.to != 'popup') return;
  
  if(request.sub == 'trueRand' && request.val != 'req'){
    trueRandBox.checked = request.val;
  }
  else if(request.sub == 'expDownload' && request.val != 'req') {
    expDownload.href = request.val;
  }
  else if(request.sub == 'expProgress') {
    expProgress.innerHTML = request.val;
    console.log(expProgress.innerHTML);
  }
  
});
