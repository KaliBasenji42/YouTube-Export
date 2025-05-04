// Variables and Constants

let video = document.querySelector('video');

let trueRand;
let URLs = [];

// Functions

function loadURLs() {
  
  let potentialLists = document.getElementsByClassName('playlist-items style-scope ytd-playlist-panel-renderer');
  
  for(let elem of potentialLists) {
    if(elem.children.length > 0) list = elem;
  }
  //console.log(list);
  
  vids = list.children;
  
  out = [];
  
  for(let vid of vids) {
    
    let child = vid.getElementsByTagName('a')[0];
    //console.log(child);
    
    try {out.push(child.getAttribute('href'));}
    catch(err) {console.log('Error getting child href: ' + err);}
      
  }
  //console.log(out);
  
  return out;
  
}

function randPL() {
  
  if(URLs.length > 0) {
    
    rand = Math.floor(Math.random() * URLs.length);
    console.log('Redirect to: ' + URLs[rand]);
    
    window.location.href = URLs[rand];
    
  }
  
}

function exportPL() {
  
  list = document.getElementById('contents');
  //console.log(list);
  
  vids = list.children;
  
  out = [];
  
  for(let vid of vids) {
    
    // Click menu
    
    let child = vid.getElementsByTagName('yt-icon-button')[0];
    //console.log(child);
    
    window.setTimeout(() => child.click(), 10);
    
    // Click share
    
    window.setTimeout(() => {
      document.getElementsByTagName('ytd-menu-service-item-renderer')[1].click();
    }, 20);
    
    // Append value & Close
    
    window.setTimeout(() => {
      try {out.push(document.getElementById('share-url').value);}
      catch(err) {console.log('Error getting child href: ' + err);}
      
      document.getElementById('close-button').click();
    }, 5000);
    
  }
  console.log(out);
  
  return out;
  
}

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({active: true}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
  console.log('Script sent: ' + msg);
  
}

// Load Data

const loadTimeout = setTimeout(() => {
  
  send('script trueRand req');
  
}, 10);

// Events

if(video) {
  
  video.addEventListener('ended', () => {
    
    console.log('Video Ended - Moving to random')
    
    if(trueRand) randPL();
    
  });
  
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('Script recived: ' + request.action);
  
  if(request.action === 'script trueRand false') trueRand = false;
  else if(request.action === 'script trueRand true') {
    URLs = loadURLs();
    console.log('Playlist length: ' + URLs.length);
    trueRand = true;
  }
  else if(request.action == 'popup export') {
    exportPL();
  }
  
});