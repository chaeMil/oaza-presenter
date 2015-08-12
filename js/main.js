var appId = chrome.runtime.id;
var presenterFreezed = false;
var content = $('#content');

window.onload = function() {

  $('#imagesButton').click(function (e) {
    console.log('adding images layout');
    content.load('layouts/images.html', function(e) {
      
    });
    
  });
  
};

$(document).on("click", '.setPresenterBg', function(event) { 
  var file = 'chrome-extension://' + appId + '/' + $(this).data('file');
  console.log('changing presenter background to: ' + file);
  chrome.app.window.get('presenter').contentWindow.changeBg(file);
});