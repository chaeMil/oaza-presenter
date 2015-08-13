var presenterFreezed = false;
var hideText = false;
var hideBg = false;

var currentText;
var currentVerse;
var currentTranslation;
var currentBg;

var content = $('#content');
var globalData;

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

window.onload = function() {
  
  setPresenterText('Oáza Presenter','version 0.1 alpha', 'github.com/chaeMil/oaza-presenter');
  
  $('#imagesButton').click(function (e) {
    addImagesLayout();
  });
  
  $('#bibleButton').click(function (e) {
    addBibleLayout();
  });
  
  if (globalData.os == 'linux') {
    $('#closeApp').addClass('left');
    $('#toolbarMenu').addClass('linux');
  }

  
  //zoom preview
  $('#preview').click(function (e) {
    console.log('toggle preview zoom');
    $(this).toggleClass('big', 1000, "easeOutSine");
  });
  
  //app close dialog
  var closeAppDialog = document.querySelector('#closeAppDialog');

  document.querySelector('#closeAppDialogYes').addEventListener("click", function(evt) {
    window.close();
  });
  
  document.querySelector('#closeAppDialogNo').addEventListener("click", function(evt) {
    closeAppDialog.close();
  });
    
  // called when the user Cancels the dialog, for example by hitting the ESC key
  closeAppDialog.addEventListener("cancel", function(evt) {
    closeAppDialog.close("canceled");
  });
  
};


// app wide buttons clicks

$(document).on("click", '.setPresenterBg', function(event) { 
  setPresenterBackground($(this).data('file'), $(this).data('blob'));
});

$(document).on("click", '.setPresenterBibleVerse', function(event) { 
  setPresenterText($(this).text(), $(this).data('verse'), $(this).data('translation'));
});

$(document).on("click", '.fullscreenPresenterButton', function(event) { 
  setPresenterFullscreen();
});

$(document).on("click", '.presenterAspectRatioButton', function(event) { 
  setPresenterAspectRatio($(this).data('ratio'));
});

$(document).on("click", '.presenterSetResolution', function(event) { 
  setPresenterResolution($(this).data('res'));
});

$(document).on("click", '#hideTextButton', function(event) { 
  if (hideText) {
    presenterToggleText(false);
  } else {
    presenterToggleText(true);
  }
});

$(document).on("click", '#hideBgButton', function(event) { 
  if (hideBg) {
    presenterToggleBg(false);
  } else {
    presenterToggleBg(true);
  }
});

$(document).on("click", '#freezePresenterButton', function(event) { 
  if (presenterFreezed) {
    presenterToggleFreezed(false);
  } else {
    presenterToggleFreezed(true);
  }
});

$(document).on("click", '#closeApp', function(event) { 
  event.preventDefault();
  closeAppDialog.showModal();
});

//app functions

function addImagesLayout() {
  content.load('layouts/images.html', function(e) {
    document.querySelector('#importImagesFolderButton').addEventListener('click', function(evt) {
      importImages();
    });
  });
}

function addBibleLayout() {
  content.load('layouts/bible.html');
}

function importImages() {
  fileSystemPermission(function(e) {
    console.log('acces to filesystem is granted');
    chrome.fileSystem.chooseEntry(
      {
        type: 'openFile',
        accepts: [
          {
            extensions: ['jpg']
          }
        ],
        acceptsMultiple: true 
      },
      function (fileEntries) {
        for(i = 0; i < fileEntries.length; i++) {
          addImage(fileEntries[i]);
        }
      });
  });
}

function addImage(entry) {
  entry.file(function(file) {
    var objectURL = URL.createObjectURL(file);
    $('#imagesGrid')
      .append('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2">' + 
      '<div class="img-16-9 setPresenterBg" data-file="' + objectURL + '" ' +
      'data-blob="blob" ' +
      'style="background-image: url(\'' + objectURL + '\');"></div></div>');
  });
}

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

// app wide keypresses 

$(document).on('keydown', function (e) {
  var key = String.fromCharCode(e.which);
  switch(key){
    case 'F':
      setPresenterFullscreen();
      break;
    case 'B':
      addBibleLayout();
      break;
    case 'O':
      addImagesLayout();
      break;
  }
});


//presenter functions 

function setPresenterAspectRatio(value) {
  globalData.presenterAspectRatio = value;
  var currentWidth = chrome.app.window.get('presenter').innerBounds.width;
  chrome.app.window.get('presenter').innerBounds.width = currentWidth + 1;
  switch(value) {
    case 0:
      $('#statusAspectRatio').text('poměr stran: neurčen');
      break;
    case 1:
      $('#statusAspectRatio').text('poměr stran: 16:9');
      break;
    case 2:
      $('#statusAspectRatio').text('poměr stran: 4:3');
      break;
    case 3:
      $('#statusAspectRatio').text('poměr stran: 1:1');
      break;
  }
}

function setPresenterResolution(res) {
  setPresenterAspectRatio(0);
  resArray = res.split("x");
  chrome.app.window.get('presenter').innerBounds.width = parseInt(resArray[0]);
  chrome.app.window.get('presenter').innerBounds.height = parseInt(resArray[1]);
}

function unfreezePresenter() {
  console.log('unfreezingPresenter');
  if (!hideBg) {
    chrome.app.window.get('presenter').contentWindow.setBgHidden(true);
  } else {
    chrome.app.window.get('presenter').contentWindow.setBgHidden(false);
  }
  
  if (!hideText) {
    chrome.app.window.get('presenter').contentWindow.setTextHidden(true);
  } else {
    chrome.app.window.get('presenter').contentWindow.setTextHidden(false);
  }
  
  setPresenterBackground(currentBg);
  setPresenterText(currentText, currentVerse, currentTranslation);
}

function presenterToggleFreezed(value) {
  if (value) {
    $('#freezePresenterButton').addClass('active');
    presenterFreezed = true;
  } else {
    $('#freezePresenterButton').removeClass('active');
    presenterFreezed = false;
    unfreezePresenter();
  }
}

function presenterToggleText(value) {
  if (value) {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setTextHidden(hideText);
    }
    $('#hideTextButton').addClass('active');
    hideText = true;
  } else {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setTextHidden(hideText);
    }
    $('#hideTextButton').removeClass('active');
    hideText = false;
  }
}

function presenterToggleBg(value) {
  if (value) {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setBgHidden(hideBg);
    }
    $('#hideBgButton').addClass('active');
    hideBg = true;
  } else {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setBgHidden(hideBg);
    }
    $('#hideBgButton').removeClass('active');
    hideBg = false;
  }
}

function setPresenterText(text, verse, translation) {
  currentText = text;
  currentVerse = verse;
  currentTranslation = translation;
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.changeText(text, verse, translation);
  }
}

function setPresenterBackground(file, isBlob) {
  currentBg = file;
  if (isBlob != 'blob') {
    file = 'chrome-extension://' + globalData.appId + '/' + file;
    $('#currentBg').attr('src', file);
  }
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.changeBg(file, isBlob);
  }
}

function setPresenterFullscreen() {
  chrome.app.window.get('presenter').contentWindow.setFullscreen();
}

function updatePreview(preview) {
  console.log('updating preview');
  $('#preview').attr("src", preview);
}


//utils

function loadImageFromUri(uri, imgElement) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    imgElement.src = window.URL.createObjectURL(xhr.response);
  };
  xhr.open('GET', uri, true);
  xhr.send();
}