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

async function clickTillElem(elem, showElem) {
  // Clicks elem till showElem is shown/exists
  
  let clickInt = setInterval(() => {
    elem.click();
    
    if(showElem) if(showElem.style.display != 'none') {
      clearInterval(clickInt);
      return
    }
  }, 10);
  
}

async function getShareURLs(videos) {
  // Clicks each share button and returns list of URLs
  // Send progress info aswell
  
  let out = [];
  
  let i = 0;
  
  for(let vid of videos) {
    
    // Variables
    let intTime = 100;
    
    // Declare all buttons in scope
    let menuBttn;
    let shareBttn;
    
    // Get menu
    let menu = vid.children[2];
    menuBttn = menu.getElementsByTagName('yt-icon-button')[0];
    //console.log(menuBttn);
    
    // Click menu
    menuBttn.click();
    
    await new Promise(resolve => {
      let interval = setInterval(() => {
        let menuItems = document.getElementsByTagName('ytd-menu-service-item-renderer')
        for(let item of menuItems) {
          if(item.getElementsByTagName('yt-formatted-string')[0].innerText == 'Share') {
            // Get share
            shareBttn = item;
            //console.log(shareBttn);
            
            // Clear
            clearInterval(interval);
            resolve();
          }
        }
      }, intTime);
    });
    
    // Click share
    shareBttn.click();
    
    await new Promise(resolve => {
      let interval = setInterval(() => {
        if(document.getElementById('share-url').clientHeight > 0) {
          if(document.getElementById('share-url').value != '') {
            // Get URL
            out.push(document.getElementById('share-url').value);
            //console.log(document.getElementById('share-url').value);
            
            // Clear
            clearInterval(interval);
            resolve();
          }
        }
      }, intTime);
    });
    
    // Get & click exit
    let exitBttn = document.getElementById('close-button');
    //console.log(exitBttn);
    exitBttn.click();
    
    // Report progress
    i++;
    try {send('script progress ' + i + '/' + videos.length);}
    catch {}
    
  }
  
  //console.log(out);
  return out;
  
}

async function exportPL() {
  
  // Get videos
  
  let vids = document.getElementById('contents').children[0].children[2].children[0].children[2].children;
  //console.log(vids);
  
  try {send('script progress 0/' + vids.length);}
  catch {}
  
  // Get URLs
  
  let out = await getShareURLs(vids);
  
  let outStr = '';
  
  for(let item of out) {
    outStr = outStr + item + '\n';
  }
  outStr.slice(-1);
  
  console.log('Playlist:')
  console.log(outStr);
  
  // Make download
  
  let blob = new Blob([outStr], {type: 'text/plain'});
  send('script download ' + URL.createObjectURL(blob));
  
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
  else if(request.action === 'popup export') {
    exportPL();
  }
  
});