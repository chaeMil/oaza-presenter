var userLang;

var presenterFreezed = false;
var hideText = false;
var hideBg = false;

var presenterFontSize = 100;
var currentText;
var currentVerse;
var currentTranslation;
var currentFont = 'roboto-slab-regular';

var currentBookNum = 0;
var currentChapterNum = 0;
var currentVerseNum = 0;

var currentBg;
var currentBgIsBlob;

var content = $('#content');
var numberOfDefaultImages = 35;
var globalData;

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

function openPresenterWindow() {
  chrome.app.window.create(
    'layouts/presenter.html',
    {
      id: 'presenter',
      frame: 'none',
      innerBounds: {
        minHeight: 480,
        minWidth: 480
      }
    },
    function(win) {
      win.onClosed.addListener(function() {
        console.log('closed presenter window');
      });
    }
  );
}

function closePresenterWindow() {
  chrome.app.window.get('presenter').close();
}

function init() {
  
  chrome.runtime.getPlatformInfo(function(info) {
    globalData.os = info.os;
    globalData.appId = chrome.runtime.id;
    
    if (globalData.os == 'linux') {
      $('#closeApp').addClass('left');
      $('#toolbarMenu').addClass('linux');
    }
  });
  
  openPresenterWindow();
  
  userLang = navigator.language || navigator.userLanguage;
  console.log('userLang: ' + userLang);
  
  $('#currentText').text('');
  $('#currentVerse').text('');
  $('#currentTranslation').text('');
  
  addImagesLayout();
  addBibleLayout();
  
  switch(userLang) {
    case 'cs':
      getLocalFile('cs');
      break;
    case 'en':
      getLocalFile('en');
      break;
    default:
      getLocalFile('en');
      break;
  }
  
  loadBibles();
  
  setTimeout(function() {
    showLayout('#layout-images');
  }, 750);
}

window.onload = function() {
  
  init();
  
  $('#imagesButton').click(function (e) {
    showLayout('#layout-images');
  });
  
  $('#bibleButton').click(function (e) {
    showLayout('#layout-bible');
  });
  
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
    
  closeAppDialog.addEventListener("cancel", function(evt) {
    closeAppDialog.close("canceled");
  });
  
  //app help keyboard dialog
  var helpKeyboardDialog = document.querySelector('#helpKeyboardDialog');
  
  document.querySelector('#helpKeyboardDialogDismiss').addEventListener("click", function(evt) {
    helpKeyboardDialog.close();
  });
    
  helpKeyboardDialog.addEventListener("cancel", function(evt) {
    helpKeyboardDialog.close("canceled");
  });
  
  //choose language dialog
  var chooseLanguageDialog = document.querySelector('#chooseLanguageDialog');
  
  document.querySelector('#chooseLanguageDismiss').addEventListener("click", function(evt) {
    chooseLanguageDialog.close();
  });
    
  chooseLanguageDialog.addEventListener("cancel", function(evt) {
    chooseLanguageDialog.close("canceled");
  });
  
  //add image folder dialog
  var addImageFolderDialog = document.querySelector('#addImageFolderDialog');
  
  document.querySelector('#addImageFolderDismiss').addEventListener("click", function(evt) {
    addImageFolderDialog.close();
  });
  
  document.querySelector('#addImageFolderAdd').addEventListener("click", function(evt) {
    createImageFolder($('#addImageFolderName').val());
    $('#addImageFolderName').val();
    addImageFolderDialog.close();
  });
    
  addImageFolderDialog.addEventListener("cancel", function(evt) {
    addImageFolderDialog.close("canceled");
  });
  
  $(document).on('keydown', function (e) {
    var key = String.fromCharCode(e.which);
    
    if (!$("input").is(":focus")) {
      switch(key){
        case 'F':
          setPresenterFullscreen();
          break;
        case 'B':
          showLayout('#layout-bible');
          break;
        case 'P':
          showLayout('#layout-images');
          break;
        case 'G':
          togglePresenterDraggable();
          break;
        case 'N':
          if (hideText) {
            presenterToggleText(false);
          } else {
            presenterToggleText(true);
          }
          break;
        case 'M':
          if (hideBg) {
            presenterToggleBg(false);
          } else {
            presenterToggleBg(true);
          }
          break;
        case 'Z':
          if (presenterFreezed) {
            presenterToggleFreezed(false);
          } else {
            presenterToggleFreezed(true);
          }
          break;
        case 'Q':
          setPresenterFontSize(-10);
          break;
        case 'W':
          setPresenterFontSize(0);
          break;
        case 'E':
          setPresenterFontSize(10);
          break;
      }
    }
  });
  
};