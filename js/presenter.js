var globalData;
var activeBgLayer = 1;

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

var activeBgLayer = 1;

function init() {
  chrome.app.window.get('mainWindow').contentWindow
    .setPresenterText('Oáza Presenter','version 0.4.1 alpha', 'github.com/chaeMil/oaza-presenter');
}

chrome.app.window.current().onBoundsChanged.addListener(function() {
  if (globalData.presenterAspectRatio !== 0) {
    setTimeout(function (e) {
      var height = chrome.app.window.current().innerBounds.height;
      switch(globalData.presenterAspectRatio) {
        case 1:
          width = parseInt(height * (16/9));
          break;
        case 2:
          width = parseInt(height * (4/3));
          break;
        case 3:
          width = height;
          break;
      }
      chrome.app.window.current().innerBounds.width = width;
    }, 1000);
  }
});

$(document).ready(function(event) {
  init();
  renderText();
});

$(document).on('keydown', function (e) {
  var key = String.fromCharCode(e.which);
  if (key == 'F') {
    setFullscreen();
  }
});

function setFullscreen() {
  chrome.app.window.get('presenter').fullscreen();
  renderText();
}

function changeBg(file) {
  console.log('changeBg ' + file);
  var canvas = $('#canvas');
  var canvas1 = $('#canvas1');
  var canvas2 = $('#canvas2');

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
  var bg = $('#bg');
  
  bg.css("background-image", "url('" + file + "')");
  
  renderText();
}

function changeText(text, verse, translation) {
  console.log('changeBibleVerse: ' + text + ' ' + verse + ' ' + translation);
  
  if (text != $('#bibleText').text()) {
    $('#bibleText').fadeOut('fast', function() {
      $(this).text(text.replace(/&&&/g, '"'));
    }).fadeIn('fast');
    $('#bibleVerse').fadeOut('fast', function() {
      $(this).text(verse);
    }).fadeIn('fast');
    $('#bibleTranslation').fadeOut('fast', function() {
      $(this).text(translation);
    }).fadeIn('fast');
  
    renderText();
  }
}

function setTextHidden(value) {
  if (value) {
    $('#bible').fadeIn(500);
  } else {
    $('#bible').fadeOut(500);
  }
}

function setBgHidden(value) {
  if (value) {
    $('#bg').fadeIn(500);
  } else {
    $('#bg').fadeOut(500);
  }
}

function getWindowRatio() {
  var height = chrome.app.window.current().innerBounds.height;
  var width = chrome.app.window.current().innerBounds.width;
  return width / height;
}

function toggleDraggable() {
  $('#draggable').toggle();
  $('#canvas').toggleClass('draggable');
}

function setFont(font) {
  $('#canvas').removeAttr('class');
  $('#canvas').addClass(font);
  renderText();
}

function setFontSize(size) {
  $('#bibleText').css('font-size', 'calc(5vw * ' + (size / 100) + ')');
  $('#bibleVerse').css('font-size', 'calc(2vw * ' + (size / 100) + ')');
  $('#bibleTranslation').css('font-size', 'calc(2vw * ' + (size / 100) + ')');
  renderText();
}

function renderText() {
  setTimeout(function (e) {
    html2canvas(document.querySelector('#bible'), {
      onrendered: function(canvas){
        console.log('rendering preview');
        chrome.app.window.get('mainWindow').contentWindow.updatePreviewText(canvas.toDataURL());
        chrome.app.window.get('mainWindow').contentWindow.updatePreview();
      },
      logging: true,
      background: undefined
    }); 
  }, 500);
}