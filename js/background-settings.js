var fileSystem = null;
var settingsFile = null;

var settings = {};
settings['bgFolders'] = [];
settings['language'] = '';

function returnSettings() {
  return settings;
}

function loadSettingsFromFile(file, callback) {
  file.file(function(fileObject) {
    
    var settings = null;
    var reader = new FileReader();
    
    reader.onloadend = function(e) {
      json = this.result;
      callback(json);
    };
    
    reader.readAsText(fileObject);
    
  });
  
}

function writeSettingsFile() {
  var data = JSON.stringify(settings);
  
  console.log('writting settings file');
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
      loadSettingsFromFile(settingsFile, function(json) {
        settings = JSON.parse(json);
      });
    });
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.type == 'setSettings') {
      
      //addBgFolder
      if (request.name === 'addBgFolder') {
        settings['bgFolders'].push(request.value);
      }
      
      //removeBgFolder
      if (request.name === 'removeBgFolder') {
        var index = settings['bgFolders'].indexOf(request.value);
        if (index >= 0) {
          settings['bgFolders'].splice(index, 1);
        }
      }
      
      //set language
      if (request.name === 'language') {
        settings['language'] = request.value;
      }
      
      console.log(settings);
      console.log(settingsFile);
      writeSettingsFile();
      if (callback !== null) {
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