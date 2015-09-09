var fileSystem = null;
var settingsFile = null;

var settings = {};
settings['bgFolders'] = [];

function returnSettings() {
  return settings;
}

function writeSettingsFile() {
  var data = JSON.stringify(settings);
  
  console.log(data);
  
  settingsFile.createWriter(function(writer) {
    writer.onwriteend = function(e) {
      console.log(e);
    };
    
    writer.onerror = function(e) {
      console.log(e);
    };
    
    var blob = new Blob([data]);
    
    writer.write(blob);
  });
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  
  chrome.syncFileSystem.requestFileSystem(function(fs) {
    fileSystem = fs;
    fs.root.getFile("settings.conf", {create: true}, function(fileEntry) {
      settingsFile = fileEntry;
    });
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.type == 'setSettings') {
      
      //addBgFolder
      if (request.name === 'addBgFolder') {
        settings['bgFolders'].push(request.value);
        console.log(settings);
        console.log(settingsFile);
        writeSettingsFile();
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