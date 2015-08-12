var presenterFreezed = false;
var content = $('#content');
var globalData;

chrome.runtime.getBackgroundPage(function(bgpage) {
   globalData = bgpage.globalData;
});

window.onload = function() {
  
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
  var file = 'chrome-extension://' + globalData.appId + '/' + $(this).data('file');
  console.log('changing presenter background to: ' + $(this).data('file'));
  setPresenterBackground(file);
});

$(document).on("click", '.setPresenterBibleVerse', function(event) { 
  setPresenterVerse($(this).text(), $(this).data('verse'), $(this).data('translation'));
});

$(document).on("click", '.fullscreenPresenterButton', function(event) { 
  setPresenterFullscreen();
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

function setPresenterVerse(text, verse, translation) {
  chrome.app.window.get('presenter').contentWindow.changeBibleVerse(text, verse, translation);
  $('#bibleText').html(text);
  $('#bibleVerse').html(verse);
  $('#bibleTranslation').html(translation);
}

function setPresenterBackground(file) {
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