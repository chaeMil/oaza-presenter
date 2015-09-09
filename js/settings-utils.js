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