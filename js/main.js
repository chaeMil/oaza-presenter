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

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

function init() {
  
  chrome.runtime.getPlatformInfo(function(info) {
    var os = info.os;
    chrome.runtime.getBackgroundPage(function(bgpage) {
      bgpage.globalData.appId = chrome.runtime.id;
      console.log("appId: " + bgpage.globalData.appId);
    });
    
    if (os == 'linux' || os == 'mac') {
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
  addSongsLayout();
  
  getSettings('all', function(settings) {
    console.log(settings);
    switch(settings['language']) {
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
  });
  
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
  
  $(document).on('click', '#songsButton', function(e) {
    showLayout('#layout-songs');
  });
  
  $(document).on('click', '#preview', function(e) {
    console.log('toggle preview zoom');
    $(this).toggleClass('big', 1000, "easeOutSine");
  });
}

function displaySyncStatus(status) {
  $('#syncStatus').text(status);
}

window.addEventListener('load', function() {
  
  init();
  showUI();
  keyControls();
  
});