// Variables

let downloadPLURL = '';

// Function

function send(toAddr, msgSub, msgVal) {
  // toAddr: String, to which script
  // msgSub: String, message subject
  // msgVal: message value
  
  let msg = {to: toAddr, from: 'background', sub: msgSub, val: msgVal};
  
  if(toAddr == 'popup') chrome.runtime.sendMessage(msg);
  
  if(toAddr == 'script') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  }
  
  console.log(msg);
  
}

// Events

chrome.runtime.onMessage.addListener((request) => {
  
  console.log(request);
  
  if(request.to != 'background') return;
  
  if(request.sub == 'expPLDownload' && request.val == 'req') {
    send(request.from, 'expPLDownload', downloadPLURL);
  }
  else if(request.sub == 'expPLDownload') {
    downloadPLURL = request.val;
    send('popup', 'expPLDownload', downloadPLURL);
  }
  
});
