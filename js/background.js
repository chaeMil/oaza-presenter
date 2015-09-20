var globalData = {};
globalData.presenterAspectRatio = 0;

var fileSystem = null;

var settingsFile = null;
var settings = {};
settings['bgFolders'] = [];
settings['language'] = '';

var songsDBFile = null;
var songsDB = [];

function returnSettings() {
  return settings;
}

function returnSongs() {
  return songsDB;
}

function loadDataFromJSONFile(file, callback) {
  file.file(function(fileObject) {
    
    var reader = new FileReader();
    
    reader.onloadend = function(e) {
      json = this.result;
      callback(json);
    };
    
    reader.readAsText(fileObject);
    
  });
  
}

function writeDataToJSONFile(input, file) {
  var data = JSON.stringify(input);

  console.log('writting json file');
  console.log(data);
  
  file.createWriter(function(writer) {
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

function displaySyncStatus(status) {
  chrome.app.window.get('mainWindow').contentWindow.displaySyncStatus(status);
}

function createWindows() {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      frame: 'none',
      innerBounds: {
        minHeight: 550,
        minWidth: 1110
      }
    }, 
    function(win) {
      
      win.onClosed.addListener(function() {
        console.log('closed main window');
        chrome.app.window.get('presenter').close();
      });
    }
  );
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  
  chrome.syncFileSystem.requestFileSystem(function(fs) {
    fileSystem = fs;
    
    fs.root.getFile("settings.json", {create: true}, function(fileEntry) {
      settingsFile = fileEntry;
      loadDataFromJSONFile(settingsFile, function(json) {
        settings = JSON.parse(json);
      });
    });
    
    fs.root.getFile("songs.json", {create: true}, function(fileEntry) {
      songsFile = fileEntry;
      loadDataFromJSONFile(songsFile, function(json) {
        songsDB = JSON.parse(json);
      });
    });
    
    createWindows();
  });
  
  chrome.syncFileSystem.getServiceStatus(function(status) {
    setTimeout(function(e) {
      displaySyncStatus(status);
    }, 1000);
  });
  
  chrome.syncFileSystem.onServiceStatusChanged.addListener(function(status) {
    console.log(status);
    displaySyncStatus(status['description']);
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
      writeDataToJSONFile(settings, settingsFile);
      if (callback !== null) {
        callback(returnSettings());
      }
    }
    
    if (request.type == 'songs') {
      
      //add song
      if (request.name == 'add') {
        songsDB.push(request.value);
      }
      
      //remove song
      if (request.name == 'delete') {
        
        console.log(songsDB);
        
        for(var i = 0; i < songsDB.length; i++) {
          if(songsDB[i].name == request.value.name) {
            songsDB.splice(i, 1);
            break;
          }
        }
        
        console.log(songsDB);
      }
      
      writeDataToJSONFile(songsDB, songsFile);
      if (callback !== null) {
        callback(returnSongs());
      }
      
    }
    
    if (request.type == 'getSongs') {
      if (request.name == 'all') {
        callback(returnSongs());
      }
    }
    
    if (request.type == 'getSettings') {
      if (request.name == 'all') {
        callback(returnSettings());
      }
    }
  });
  
});