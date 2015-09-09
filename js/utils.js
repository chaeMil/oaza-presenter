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

function log(msg) {
  console.log(msg, arguments);
}

function error(msg) {
  console.log('ERROR: ', arguments);
  var message = '';
  for (var i = 0; i < arguments.length; i++) {
    var description = '';
    if (arguments[i] instanceof FileError) {
      switch (arguments[i].code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          description = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          description = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          description = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          description = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          description = 'INVALID_STATE_ERR';
          break;
        default:
          description = 'Unknown Error';
          break;
      }
      message += ': ' + description;
    } else if (arguments[i].fullPath) {
      message += arguments[i].fullPath + ' ';
    } else {
      message += arguments[i] + ' ';
    }
  }
}