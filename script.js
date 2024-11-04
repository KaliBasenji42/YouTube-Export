// Variables and Constants

let video = document.querySelector('video');

let videos = document.getElementsByClassName('playlist-items style-scope ytd-playlist-panel-renderer')[2].children;

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

function loadURLs(vids) {
  
  out = [];
  
  for(let i = 0; i < vids.length; i++) {
    
    child = vids[i].getElementsByClassName('yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer');
    out.push(child.href);
    
  }
  
  return out;
  
}

// Events

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  try {
    if(request.action === 'spin' && run) spin();
    
    if(request.action === 'load') loadSpin();
    
    if(request.action.slice(0,1) === 't' && request.action.length > 1) {
      time = parseFloat(request.action.slice(1));
      loadSpin();
    }
    
    if(request.action.slice(0,1) === 'e' && request.action.length > 1) {
      trigger = request.action.slice(1,2);
      loadSpin();
    }
  }
  catch (error) {
    console.error('Error processing input:', error);
  }
});
