function setSettings(key, val, callback) {
  chrome.runtime.sendMessage(
    {
      type: 'setSettings',
      name: key, 
      value: val
    }, 
    function(e) {
      if (callback !== null) {
        callback(e);
      }
    });
}

function getSettings(key, callback) {
  chrome.runtime.sendMessage( {
    type: 'getSettings',
    name: key
  },
  function (e) {
    if (callback !== null) {
      callback(e);
    }
  });
}

function songs(key, val, callback) {
  chrome.runtime.sendMessage(
    {
      type: 'songs',
      name: key, 
      value: val
    }, 
    function(e) {
      if (callback !== null) {
        callback(e);
      }
    });
}

function getSongs(callback) {
  chrome.runtime.sendMessage( {
    type: 'getSongs',
    name: 'all'
  },
  function (e) {
    if (callback !== null) {
      callback(e);
    }
  });
}