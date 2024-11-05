// Variables and Constants

let video = document.querySelector('video');

let skipAd;

let URLs = [];
let PLData = {};
let PLName = '';

// Functions

function loadURLs() {
  
  vids = document.getElementsByClassName('playlist-items style-scope ytd-playlist-panel-renderer')[2].children;
  
  out = [];
  
  for(let i = 0; i < vids.length; i++) {
    
    child = vids[i].getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer')[0];
    out.push(child.getAttribute('href'));
    
  }
  
  return out;
  
}

function loadPL() {
  
  if(PLName != '') URLs = PLData[PLName];
  
}

function savePL() {
  
  URLs = loadURLs();
  
  if(PLName != '') PLData[PLName] = URLs;
  
}

function delPL() {
  
  if(PLName != '') delete PLData[PLName];
  
}

function randPL() {
  
  rand = Math.floor(Math.random() * URLs.length);
  console.log('Redirect to: ' + URLs[rand]);
  
  window.Location.href = URLs[rand];
  
}

function loadSkipAd() {
  
  skipAd = document.getElementsByClassName('ytp-skip-ad-button')[0];
  console.log('Skip Ad:');
  console.log(skipAd);
  
  send('showSkip req');
  
  const loadSkipAdTimeout = setTimeout(send, 500, 'showSkip req');
  
}

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
}

// Events

video.addEventListener('ended', () => {
  
  if(PLName != '') randPL();
  
});

document.addEventListener('keypress', () => {
  
  if(event.key == 's') loadSkipAd();
  
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('script recived: ' + request.action);
  
  if(request.action.slice(0,2) === 'PL') PLName = request.action.slice(2);
  if(request.action === 'loadPL') loadPL();
  if(request.action === 'savePL') savePL();
  if(request.action === 'delPL') delPL();
  
  if(request.action === 'showSkip true') skipAd.style.display = 'block';
  
});
