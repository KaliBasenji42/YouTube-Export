// Variables and Constants

let video = document.querySelector('video');

// Functions

function saveData(key, value) {
  
  let data = {};
  
  data[key] = value;
  
  chrome.storage.local.set(data, function() {
    console.log('Saved ' + value + ' to ' + key);
  });
  
}

function getData(key) {
  
  chrome.storage.local.get([key], function(result) {
    console.log('Got ' + result[key] + ' to ' + key);
    return result;
  });
  
}

function loadURLs() {
  
  vids = document.getElementsByClassName('playlist-items style-scope ytd-playlist-panel-renderer')[2].children;
  
  out = [];
  
  for(let i = 0; i < vids.length; i++) {
    
    child = vids[i].getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer')[0];
    out.push(child.getAttribute('href'));
    
  }
  
  return out;
  
}

// Events

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  try {
    if(request.action === 'loadURLs') console.log(loadURLs());
  }
  catch (error) {
    console.error('Error processing input:', error);
  }
});
