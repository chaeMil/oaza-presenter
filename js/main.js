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
var numberOfDefaultBgs = 35;
var globalData;

var fileSystem = null;
var settingsFile = null;

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

function init() {
  
  chrome.syncFileSystem.requestFileSystem(function(fs) {
    fileSystem = fs;
    /*fs.root.getFile("settings.conf", {create: true}, function(fileEntry) {
      settingsFile = fileEntry;
      readSettings(fileEntry);
    });*/
  });
  
  chrome.runtime.getPlatformInfo(function(info) {
    var os = info.os;
    chrome.runtime.getBackgroundPage(function(bgpage) {
      bgpage.globalData.appId = chrome.runtime.id;
      console.log("appId: " + bgpage.globalData.appId);
    });
    
    if (os == 'linux') {
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
  
  addBgsLayout();
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
}

function showUI() {
  setTimeout(function() {
    
    $('#initAnimation').fadeOut();
    
    setTimeout(function() {
      
      content.removeClass('hidden');
      $('sidebar.left').removeClass('hidden').show();
      $('sidebar.right').removeClass('hidden');
      $('#menubar').removeClass('hidden');
      showLayout('#layout-backgrounds');
      
      initSidebarButtons();
      
      updatePreview();
      
    }, 500);
  }, 3000);
}

function initSidebarButtons() {
  $(document).on('click', '#bgsButton', function(e) {
    showLayout('#layout-backgrounds');
  });
  
  $(document).on('click', '#bibleButton', function(e) {
    showLayout('#layout-bible');
  });
  
  $(document).on('click', '#preview', function(e) {
    console.log('toggle preview zoom');
    $(this).toggleClass('big', 1000, "easeOutSine");
  });
}

window.addEventListener('load', function() {
  
  init();
  showUI();
  
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
          showLayout('#layout-backgrounds');
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
        case 'X':
          getSettings('all', function(e) {
            console.log(e);
          });
          break;
      }
    }
  });
  
});