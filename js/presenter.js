var activeBgLayer = 1;

window.oncontextmenu = function(event) {
  /*event.preventDefault();
  event.stopPropagation();
  return false;*/
};

$(document).ready(function(event) {
  renderPreview();
});

$(document).on('keydown', function (e) {
  var key = String.fromCharCode(e.which);
  if (key == 'F') {
    setFullscreen();
  }
});

function setFullscreen() {
  chrome.app.window.get('presenter').fullscreen();
}

function changeBg(file) {
  console.log('changeBg ' + file);
  var canvas = $('#canvas');
  var canvas1 = $('#canvas1');
  var canvas2 = $('#canvas2');
  $('#previewBackdrop').attr("src", file);
  
  if (activeBgLayer == 1) {
    activeBgLayer = 2;
    
    canvas2.show();
    canvas2.css("z-index", 40);
    canvas1.css("z-index", 41);
    canvas2.css("background-image", "url('" + file + "')");
    canvas1.fadeOut(500);
  } else {
    activeBgLayer = 1;
    
    canvas1.show();
    canvas1.css("z-index", 40);
    canvas2.css("z-index", 41);
    canvas1.css("background-image", "url('" + file + "')");
    canvas2.fadeOut(500);
  }

  renderPreview();
}

function changeBibleVerse(text, verse, translation) {
  console.log('changeBibleVerse: ' + text + ' ' + verse + ' ' + translation);
  $('#bibleText').html(text);
  $('#bibleVerse').html(verse);
  $('#bibleTranslation').html(translation);
  
  renderPreview();
}

function setTextVisible(value) {
  if (value) {
    $('#bible').show();
  } else {
    $('#bible').hide();
  }
  
  renderPreview();
}

function renderPreview() {
  setTimeout(function (e) {
    html2canvas(document.body, {
      onrendered: function(canvas){
        console.log('rendering preview');
        chrome.app.window.get('mainWindow').contentWindow.updatePreview(canvas.toDataURL());
      },
      logging: true,
      background: undefined
    }); 
  }, 500);
}