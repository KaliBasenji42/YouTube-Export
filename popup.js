// Variables and Constants

let showSkipBox = document.getElementById('showSkip');

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
    
    if(chrome.runtime.lastError) reject(chrome.runtime.lastError);
    
    else {
      console.log('Got ' + result[key] + ' from ' + key);
      resolve(result[key]);
    }
    
  });
  
}

function getData(key) {
  
  chrome.storage.local.get([key], function(result) {
    console.log('Got ' + result[key] + ' to ' + key);
    return result;
  });
  
}

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

function setData() {
  
  showSkipBox.checked = showSkip;
  console.log('State: ' + showSkip);
  
}

// Data

let showSkip = getData('showSkip');
console.log('showSkip: ' + showSkip);

// Events

document.addEventListener('DOMContentLoaded', () => {
  
  setData();
  
})

document.getElementById('loadPL').addEventListener('click', () => {
  send('loadURLs');
});

showSkipBox.addEventListener('input', () => {
  saveData('showSkip', showSkipBox.checked);
})
