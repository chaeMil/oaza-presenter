var settings = {};
settings['bgFolders'] = [];

function returnSettings() {
  return settings;
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.type == 'setSettings') {
      
      //addBgFolder
      if (request.name === 'addBgFolder') {
        settings['bgFolders'].push(request.value);
        console.log(settings);
        callback(returnSettings());
      }
      
      //removeBgFolder
      if (request.name === 'removeBgFolder') {
        var index = settings['bgFolders'].indexOf(request.value);
        if (index >= 0) {
          settings['bgFolders'].splice(index, 1);
        }
        console.log(settings);
        callback(returnSettings());
      }
    }
    
    if (request.type == 'getSettings') {
      if (request.name == 'all') {
        callback(returnSettings());
      }
    }
  });
  
});