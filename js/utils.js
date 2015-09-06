function fileSystemPermission(callback) {
  chrome.permissions.request({
    permissions: [
      'fileSystem',
      'fileSystem.write',
      'fileSystem.retainEntries',
      'fileSystem.directory'
    ]
  }, function(granted) {
    if (granted) {
      callback(); 
      
    } else {
      console.log('ERROR: acces to filesystem was not granted!');
    }
  });
}

function saveOption(key, value) {
  /*var sKey = key;
  var sValue = value;
  chrome.storage.local.set({key: value}, function() {
    console.log('saved: ' + sKey + ":" + sValue);
  });
  
  chrome.storage.sync.set({ sKey : sValue }, function() {
		if (chrome.runtime.error) {
			console.log("Runtime error.");
		}
	});*/
}

function getOption(key) {
  /*chrome.storage.local.get(key, function(items) {
		console.debug(key + ' = ' + items[key]);
		console.debug(items);
  });
  
  chrome.storage.sync.get(key, function(items) {
		if (!chrome.runtime.error) {
			console.log(items);
			document.getElementById("data").innerText = items.data;
		}
	});*/
}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function loadImageFromUri(uri, imgElement) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    imgElement.src = window.URL.createObjectURL(xhr.response);
  };
  xhr.open('GET', uri, true);
  xhr.send();
}