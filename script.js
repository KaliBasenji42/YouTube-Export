// Variables and Constants

let stopPLExp = false;
let exportingPL = false;

let stopSubExp = false;
let exportingSub = false;

// Export Playlist Functions

function loadPLURLsaskdhjkasnd() {
  
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

async function getPLShareURLs(videos, start, stop, numVids) {
  // Clicks each share button and returns list of URLs, in playlist
  // Send progress info aswell
  
  let out = [];
  let i = 0;
  let progressHTML = '';
  
  for(let vid of videos) {
    
    i++;
    
    // Control
    
    if(stopPLExp) break;
    
    // Clicks
    
    try{
      
      // Variables
      let intTime = 100;
      
      // Declare all buttons in scope
      let menuBttn;
      let shareBttn;
      
      // Get menu
      menuBttn = vid.querySelector('yt-icon-button#button.dropdown-trigger.style-scope.ytd-menu-renderer');
      //console.log(menuBttn);
      
      // Click menu
      menuBttn.click();
      
      await new Promise(resolve => {
        let interval = setInterval(() => {
          let menuItems = document.querySelectorAll('ytd-menu-service-item-renderer.style-scope.ytd-menu-popup-renderer');
          for(let item of menuItems) {
            if(item.querySelector('yt-formatted-string').innerText == 'Share') {
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
          if(document.querySelector('input#share-url').clientHeight > 0) {
            if(document.querySelector('input#share-url').value != '') {
              // Get URL
              out.push(document.querySelector('input#share-url').value);
              //console.log(document.getElementById('share-url').value);
              
              // Clear
              clearInterval(interval);
              resolve();
            }
          }
        }, intTime);
      });
      
      // Get & click exit
      let exitBttn = document.querySelector('yt-icon-button#close-button');
      //console.log(exitBttn);
      exitBttn.click();
      
      // Progress
      progressHTML = (i + start) + ' of ' + numVids + ' | ' + 
                     (start + 1) + ' to ' + stop + 
                     '<br>' + i + ' / ' + videos.length + ': ' + 
                     Math.round((i / videos.length) * 100) + '%';
      
    }
    
    catch {
      // Record err
      progressHTML = 'Error at:<br>' + progressHTML;
      out.push('Failed to get #' + (i + start) + ' of ' + numVids);
    }
    
    // Send progress
    
    try {send('popup', 'expPLProgress', progressHTML);}
    catch {}
    
    // Auto save
    
    if(i % 50 == 0) {
      expPLDownload(out);
    }
    
  }
  
  //console.log(out);
  return out;
  
}

function expPLDownload(list) {
  
  // Variables
  
  let outStr = '';
  
  // Iterate through list
  
  for(let item of list) {
    outStr = outStr + item + '\n';
  }
  outStr.slice(-1);
  
  // Out
  
  let blob = new Blob([outStr], {type: 'text/plain'}); // Blob
  send('background', 'expPLDownload', URL.createObjectURL(blob)); // Send
  
}

async function exportPL(start, stop) {
  
  exportingPL = true;
  
  // Get videos
  
  let vids = Array.from(document.querySelector('div#contents.style-scope.ytd-playlist-video-list-renderer').children);
  numVids = vids.length;
  //console.log(vids);
  
  // Clamp start/stop
  
  if(start == '') start = 0;
  else start = Number(start);
  
  if(stop == '') stop = vids.length;
  else stop = Number(stop);
  
  start = start - 1;
  
  start = Math.max(0, start);
  start = Math.min(vids.length - 1, start);
  stop = Math.max(start + 1, stop);
  stop = Math.min(vids.length, stop);
  
  console.log([start, stop]);
  
  vids = vids.slice(start, stop);
  //console.log(vids);
  
  // Get URLs
  
  let out = await getPLShareURLs(vids, start, stop, numVids);
  
  // Make download
  
  expPLDownload(out);
  
  exportingPL = false;
  
}

function send(toAddr, msgSub, msgVal) {
  // toAddr: String, to which script
  // msgSub: String, message subject
  // msgVal: message value
  
  let msg = {to: toAddr, from: 'script', sub: msgSub, val: msgVal};
  
  if(true) chrome.runtime.sendMessage(msg);
  
  if(false) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
  
  console.log(msg);
  
}

// Events

chrome.runtime.onMessage.addListener((request) => {
  
  console.log(request);
  
  if(request.to != 'script') return;
  
  if(request.sub == 'expPL' && request.val == 'stop') {
    stopPLExp = true;
  }
  else if(request.sub == 'expPL' && !exportingPL) {
    stopPLExp = false;
    exportPL(request.val[0], request.val[1]);
  }
  
});