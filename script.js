// Variables and Constants

let video = document.querySelector('video');

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

function saveData(key, value) {
  
  let data = {};
  
  data[key] = value;
  
  chrome.storage.local.set(data, function() {
    console.log('Saved ' + value + ' to ' + key);
  });
  
}

function getData(key) {
  
  chrome.storage.local.get([key], function(result) {
    
    if(chrome.runtime.lastError) reject(chrome.runtime.lastError);
    
    else {
      console.log('Got ' + result[key] + ' from ' + key);
      resolve(result[key]);
    }
    
  });
  
}
y
function send(msg) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: msg});
  });

  if(logCheck.checked) {
    
    output.innerHTML += 'Sent: ' + msg + '<br>';
    output.style.transition = 'none';
    output.style.backgroundColor = 'rgb(0,192,0)';
    window.setTimeout(flashOutput, 10);
    
  }
  
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
