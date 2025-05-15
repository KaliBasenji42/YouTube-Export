// Variables and Constants

let trueRandBox = document.getElementById('trueRand');

let navs = document.querySelectorAll('td.nav');
let sects = document.getElementsByClassName('sect');

let exportBttn = document.getElementById('export');
let exportStopBttn = document.getElementById('exportStop');
let expProgress = document.getElementById('expProgress');
let expStart = document.getElementById('expStart');
let expStop = document.getElementById('expStop');
let expDownload = document.getElementById('expDownload')

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

// Nav events

for(let nav of navs) {
  nav.addEventListener('click', () => {
    
    // Selected
    
    for(let n of navs) {
      n.className = 'nav';
    }
    
    nav.className = 'nav navSel';
    
    // Sect
    
    for(let sect of sects) {
      sect.className = 'sect';
      if(sect.id == nav.id) {
        sect.className = 'sect navSel';
      }
    }
    
  });
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
  console.log([expStart.value, expStop.value]);
  send('script', 'export', [expStart.value, expStop.value]);
});

exportStopBttn.addEventListener('click', () => {
  send('script', 'export', 'stop');
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
