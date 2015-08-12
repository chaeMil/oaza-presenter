window.oncontextmenu = function(event) {
  /*event.preventDefault();
  event.stopPropagation();
  return false;*/
};

$(document).on('keydown', function (e) {
  var key = String.fromCharCode(e.which);
  if (key == 'F') {
    chrome.app.window.get('presenter').fullscreen();
  }
});

function changeBg(file) {
  console.log('changeBg ' + file);
  $('#canvas').css('background-image', 'url(' + file + ')');
}