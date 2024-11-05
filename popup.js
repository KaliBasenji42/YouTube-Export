// Variables and Constants

let showSkipBox = document.getElementById('showSkip');

// Functions

function send(msg) {
  
  chrome.runtime.sendMessage({action: msg});
  
  chrome.tabs.query({}, (tabs) => {
    
    for(let i = 0; i < tabs.length; i++) {
      
      chrome.tabs.sendMessage(tabs[i].id, {action: msg});
      
    }
    
  });
  
}

// Events

document.addEventListener('DOMContentLoaded', () => {
  
  send('showSkip req');
  
})

document.getElementById('loadPL').addEventListener('click', () => {
  send('loadPL');
});

showSkipBox.addEventListener('input', () => {
  send('showSkip ' + showSkipBox.checked);
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  console.log('popup recived: ' + request.action);
  
  if(request.action === 'showSkip true') showSkipBox.checked = true;
  if(request.action === 'showSkip false') showSkipBox.checked = false;
  
});
