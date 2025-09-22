// Variables and Constants

let navs = document.querySelectorAll('td.nav');
let sects = document.getElementsByClassName('sect');

let footerDetailsButton = document.getElementById('footerDetailsButton');

let expPLBttn = document.getElementById('expPL');
let expPLStopBttn = document.getElementById('expPLStopBttn');
let expPLProgress = document.getElementById('expPLProgress');
let expPLStart = document.getElementById('expPLStart');
let expPLStop = document.getElementById('expPLStop');
let expPLDownload = document.getElementById('expPLDownload');

// Functions

function expndOrClps(ID, bttnID) {
  
  sect = document.getElementById(ID);
  bttn = document.getElementById(bttnID);
  height = "" + (sect.scrollHeight + 100) + "px";
  
  if(sect.style.maxHeight ==  "0px") {
    
    sect.style.maxHeight = height;
    bttn.style.transform = "rotate(0deg)";
    
  }
  else {
    
    sect.style.maxHeight = "0px";
    bttn.style.transform = "rotate(270deg)";
    
  }
  
}

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

// Footer

footerDetailsButton = document.getElementById('footerDetailsButton');
expndOrClps('footerDetails', 'footerDetailsButton'); // To init Footer Details CSS
//console.log(footerDetailsButton);
footerDetailsButton.addEventListener('click', () => { // Footer Details Button
  expndOrClps('footerDetails', 'footerDetailsButton');
});

// Events

document.addEventListener('DOMContentLoaded', () => {
  send('background', 'expPLDownload', 'req');
});

expPLBttn.addEventListener('click', () => {
  //console.log([expPLStart.value, expPLStop.value]);
  send('script', 'expPL', [expPLStart.value, expPLStop.value]);
});

expPLStopBttn.addEventListener('click', () => {
  send('script', 'expPL', 'stop');
});

expPLDownload.addEventListener('click', function(event) {
  if(expPLDownload.href.slice(0, 'chrome-extension://'.length) == 'chrome-extension://') event.preventDefault();
});

chrome.runtime.onMessage.addListener((request) => {
  
  console.log(request);
  
  if(request.to != 'popup') return;
  
  if(request.sub == 'expPLDownload' && request.val != 'req') {
    expPLDownload.href = request.val;
  }
  else if(request.sub == 'expPLProgress') {
    expPLProgress.innerHTML = request.val;
    console.log(expPLProgress.innerHTML);
  }
  
});
