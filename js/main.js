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
    console.log('adding images layout');
    content.load('layouts/images.html', function(e) {
    });
  });
  
  $('#bibleButton').click(function (e) {
    console.log('adding bible layout');
    content.load('layouts/bible.html', function(e) {
    });
  });
  
  if (globalData.os == 'linux') {
    $('#closeApp').addClass('left');
    $('#toolbarMenu').addClass('linux');
  }
  
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
  setPresenterBackground($(this).data('file'));
});

$(document).on("click", '.setPresenterBibleVerse', function(event) { 
  setPresenterText($(this).text(), $(this).data('verse'), $(this).data('translation'));
});

$(document).on("click", '.fullscreenPresenterButton', function(event) { 
  setPresenterFullscreen();
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

// app wide keypresses 

$(document).on('keydown', function (e) {
  var key = String.fromCharCode(e.which);
  if (key == 'F') {
    setPresenterFullscreen();
  }
});


//presenter functions 

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

function setPresenterBackground(file) {
  currentBg = file;
  file = 'chrome-extension://' + globalData.appId + '/' + file;
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.changeBg(file);
  }
}

function setPresenterFullscreen() {
  chrome.app.window.get('presenter').contentWindow.setFullscreen();
}

function updatePreview(preview) {
  console.log('updating preview');
  $('#preview').attr("src", preview);
}