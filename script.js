// Variables and Constants

let stopPLExp = false;
let exportingPL = false;

let stopSubExp = false;
let exportingSub = false;

// Export Playlist Functions

async function getPLShareURLs(videos, start, stop, numVids) {
  // Clicks each share button and returns list of URLs, in playlist
  // Sends progress info as well
  
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
  let numVids = vids.length;
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

// Export Subscriptions Functions

async function getSubURLs(channels, start, stop, numChannels) {
  // Gets HREF of each channel link, in subscriptions
  // Sends progress info as well
  
  let out = [];
  let i = 0;
  let progressHTML = '';
  
  for(let channel of channels) {
    
    i++;
    
    // Control
    
    if(stopSubExp) break;
    
    // Get HREFs
    
    try{
      
      // Variables
      let delay = 0;
      
      // Get HREF
      await new Promise(resolve => {
        let timeout = setTimeout(() => {
          out.push(channel.href);
          resolve();
        }, delay);
      });
      
      // Progress
      progressHTML = (i + start) + ' of ' + numChannels + ' | ' + 
                     (start + 1) + ' to ' + stop + 
                     '<br>' + i + ' / ' + channels.length + ': ' + 
                     Math.round((i / channels.length) * 100) + '%';
      
    }
    
    catch {
      // Record err
      progressHTML = 'Error at:<br>' + progressHTML;
      out.push('Failed to get #' + (i + start) + ' of ' + numChannels);
    }
    
    // Send progress
    
    try {send('popup', 'expSubProgress', progressHTML);}
    catch {}
    
    // Auto save
    
    if(i % 50 == 0) {
      expSubDownload(out);
    }
    
  }
  
  //console.log(out);
  return out;
  
}

function expSubDownload(list) {
  
  // Variables
  
  let outStr = '';
  
  // Iterate through list
  
  for(let item of list) {
    outStr = outStr + item + '\n';
  }
  outStr.slice(-1);
  
  // Out
  
  let blob = new Blob([outStr], {type: 'text/plain'}); // Blob
  send('background', 'expSubDownload', URL.createObjectURL(blob)); // Send
  
}

async function exportSub(start, stop) {
  
  exportingSub = true;
  
  // Get videos
  
  let channels = Array.from(document.querySelectorAll('#main-link.channel-link.yt-simple-endpoint.style-scope.ytd-channel-renderer'));
  let numChannels = channels.length;
  console.log(channels);
  
  // Clamp start/stop
  
  if(start == '') start = 0;
  else start = Number(start);
  
  if(stop == '') stop = channels.length;
  else stop = Number(stop);
  
  start = start - 1;
  
  start = Math.max(0, start);
  start = Math.min(channels.length - 1, start);
  stop = Math.max(start + 1, stop);
  stop = Math.min(channels.length, stop);
  
  console.log([start, stop]);
  
  channels = channels.slice(start, stop);
  
  // Get URLs
  
  let out = await getSubURLs(channels, start, stop, numChannels);
  
  // Make download
  
  expSubDownload(out);
  
  exportingSub = false;
  
}

// Other Functions

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
  else if(request.sub == 'expSub' && request.val == 'stop') {
    stopSubExp = true;
  }
  else if(request.sub == 'expSub' && !exportingSub) {
    stopSubExp = false;
    exportSub(request.val[0], request.val[1]);
  }
  
});