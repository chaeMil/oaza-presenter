var globalData;

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

var activeBgLayer = 1;

window.oncontextmenu = function(event) {
  /*event.preventDefault();
  event.stopPropagation();
  return false;*/
};

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
  var bg = $('#bg');
  
  bg.css("background-image", "url('" + file + "')");
  
  renderText();
}

function changeText(text, verse, translation) {
  console.log('changeBibleVerse: ' + text + ' ' + verse + ' ' + translation);
  
  if (text != $('#bibleText').text()) {
    $('#bibleText').fadeOut('fast', function() {
      $(this).text(text);
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
    $('#bg').css('opacity', 1);
  } else {
    $('#bg').css('opacity', 0);
  }
}

function getWindowRatio() {
  var height = chrome.app.window.current().innerBounds.height;
  var width = chrome.app.window.current().innerBounds.width;
  return width / height;
}

function toggleDraggable() {
  $('#draggable').toggle();
}

function setFont(font) {
  $('#canvas').removeAttr('class');
  $('#canvas').addClass(font);
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