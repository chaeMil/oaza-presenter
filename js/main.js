var presenterFreezed = false;
var hideText = false;
var hideBg = false;

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
    hideText = false;
  } else {
    presenterToggleText(true);
    hideText = true;
  }
});

$(document).on("click", '#hideBgButton', function(event) { 
  if (hideBg) {
    presenterToggleBg(false);
    hideBg = false;
  } else {
    presenterToggleBg(true);
    hideBg = true;
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

function presenterToggleText(value) {
  if (value) {
    chrome.app.window.get('presenter').contentWindow.setTextVisible(hideText);
    $('#hideTextButton').addClass('active');
  } else {
    chrome.app.window.get('presenter').contentWindow.setTextVisible(hideText);
    $('#hideTextButton').removeClass('active');
  }
}

function presenterToggleBg(value) {
  if (value) {
    chrome.app.window.get('presenter').contentWindow.setBgVisible(hideBg);
    $('#hideBgButton').addClass('active');
  } else {
    chrome.app.window.get('presenter').contentWindow.setBgVisible(hideBg);
    $('#hideBgButton').removeClass('active');
  }
}

function setPresenterText(text, verse, translation) {
  chrome.app.window.get('presenter').contentWindow.changeText(text, verse, translation);
}

function setPresenterBackground(file) {
  file = 'chrome-extension://' + globalData.appId + '/' + file;
  chrome.app.window.get('presenter').contentWindow.changeBg(file);
  //$('#preview').css('background-image', 'url(' + file + ')');
}

function setPresenterFullscreen() {
  chrome.app.window.get('presenter').contentWindow.setFullscreen();
}

function updatePreview(preview) {
  console.log('updating preview');
  $('#preview').attr("src", preview);
}