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
  
};

$(document).on("click", '.setPresenterBg', function(event) { 
  var file = 'chrome-extension://' + globalData.appId + '/' + $(this).data('file');
  console.log('changing presenter background to: ' + file);
  chrome.app.window.get('presenter').contentWindow.changeBg(file);
});


$(document).on("click", '.setPresenterBibleVerse', function(event) { 
  chrome.app.window.get('presenter').contentWindow.changeBibleVerse($(this).text(),
    $(this).data('verse'), $(this).data('translation'));
});

$(document).on("click", '#closeApp', function(event) { 
  window.close();
});