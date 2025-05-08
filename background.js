// Variables

let trueRand = false;
let URLs = [];
let downloadURL = '';

// Function

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({active: true}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
  console.log('Background sent: ' + msg);
  
}

// Events

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('Background recived: ' + request.action);
  
  if(request.action === 'popup trueRand req') send('popup trueRand ' + trueRand);
  else if(request.action === 'script trueRand req') send('script trueRand ' + trueRand);
  else if(request.action === 'popup trueRand true'){
    trueRand = true;
    send('script trueRand ' + trueRand);
  }
  else if(request.action === 'popup trueRand false'){
    trueRand = false;
    send('script trueRand ' + trueRand);
  }
  else if(request.action.slice(0, 'script download '.length) === 'script download ') {
    downloadURL = request.action.slice('script download '.length);
    send('popup download ' + downloadURL);
  }
  else if(request.action === 'popup download req') {
    send('popup download ' + downloadURL);
  }
  
});
