// Variables and Constants

loadPLBttn = document.getElementById('loadPL');

// Functions

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

document.getElementById('loadPL').addEventListener('click', () => {
  send('loadURLs');
});
