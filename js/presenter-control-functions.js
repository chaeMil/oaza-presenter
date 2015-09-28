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

function setPresenterFontSize(value) {
  if (value === 0) {
    presenterFontSize = 100;
  } else if (value > 0) {
    if (presenterFontSize + value <= 200) {
      presenterFontSize += value;
    }
  } else {
    if (presenterFontSize - Math.abs(value) >= 10) {
      presenterFontSize = presenterFontSize - Math.abs(value);
    }
  }
  
  $('#statusPresenterFontSize').html(presenterFontSize + "%");
  
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.setFontSize(presenterFontSize);
  }
}

function setPresenterFont(font, fontName) {
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.setFont(font);
  }
  currentFont = font;
  $('#statusPresenterFont').html(fontName);
}

function togglePresenterDraggable() {
  chrome.app.window.get('presenter').contentWindow.toggleDraggable();
}

function setPresenterAspectRatio(value) {
  globalData.presenterAspectRatio = value;
  var currentWidth = chrome.app.window.get('presenter').innerBounds.width;
  chrome.app.window.get('presenter').innerBounds.width = currentWidth + 1;
  switch(value) {
    case 0:
      $('#statusAspectRatio').text('');
      break;
    case 1:
      $('#statusAspectRatio').text('16:9');
      break;
    case 2:
      $('#statusAspectRatio').text('4:3');
      break;
    case 3:
      $('#statusAspectRatio').text('1:1');
      break;
  }
}

function setPresenterResolution(res) {
  setPresenterAspectRatio(0);
  resArray = res.split("x");
  chrome.app.window.get('presenter').innerBounds.width = parseInt(resArray[0]);
  chrome.app.window.get('presenter').innerBounds.height = parseInt(resArray[1]);
}

function unfreezePresenter() {
  console.log('unfreezingPresenter');
  
  setPresenterBackground(currentBg, currentBgIsBlob);
  setPresenterText(currentText, currentVerse, currentTranslation);
  chrome.app.window.get('presenter').contentWindow.setFontSize(presenterFontSize);
  chrome.app.window.get('presenter').contentWindow.setFont(currentFont);
  
  if (!hideBg) {
    chrome.app.window.get('presenter').contentWindow.setBgHidden(true);
    $('#preview').css({"background-image":"url('" + currentBg + "')"});
  } else {
    chrome.app.window.get('presenter').contentWindow.setBgHidden(false);
    $('#preview').css({"background-image":"none"});
  }
  
  if (!hideText) {
    chrome.app.window.get('presenter').contentWindow.setTextHidden(true);
    $('#previewText').css('opacity', 1);
  } else {
    chrome.app.window.get('presenter').contentWindow.setTextHidden(false);
    $('#previewText').css('opacity', 0);
  }
}

function presenterToggleFreezed(value) {
  if (value) {
    $('#freezePresenterButton').addClass('active');
    presenterFreezed = true;
  } else {
    $('#freezePresenterButton').removeClass('active');
    presenterFreezed = false;
    unfreezePresenter();
  }
}

function presenterToggleText(value) {
  if (value) {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setTextHidden(hideText);
      $('#previewText').css('opacity', 0);
    }
    $('#hideTextButton').addClass('active');
    hideText = true;
  } else {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setTextHidden(hideText);
      $('#previewText').css('opacity', 1);
    }
    $('#hideTextButton').removeClass('active');
    hideText = false;
  }
}

function presenterToggleBg(value) {
  if (value) {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setBgHidden(hideBg);
      $('#preview').css("background-image", "none");
    }
    $('#hideBgButton').addClass('active');
    hideBg = true;
  } else {
    if (!presenterFreezed) {
      chrome.app.window.get('presenter').contentWindow.setBgHidden(hideBg);
      console.log(currentBg);
      $('#preview').css({"background-image":"url('" + currentBg + "')"});
    }
    $('#hideBgButton').removeClass('active');
    hideBg = false;
  }
}

function setPresenterText(text, verse, translation, saveHistory) {
  currentText = text;
  currentVerse = verse;
  currentTranslation = translation;
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.changeText(text, verse, 
      translation);
  }
  $('#currentText').text(text.replace(/&&&/g, '"'));
  $('#currentVerse').text(verse);
  $('#currentTranslation').text(translation);
  
  if(!presenterFreezed) {
    if (saveHistory) {
      $('#bibleHistory').prepend('<option data-text="' + text + 
        '" data-verse="' + verse + '" data-translation="' + translation + '">' + 
        verse + '</option>');
    }
  }
}

function setPresenterBackground(file, isBlob) {
  currentBg = null;
  currentBg = file;
  currentBgIsBlob = isBlob;
  console.log(currentBg);
  if (isBlob != 'blob') {
    file = 'chrome-extension://' + globalData.appId + '/' + file;
  }
  $('#currentBg').attr('src', file);
  if (!presenterFreezed) {
    chrome.app.window.get('presenter').contentWindow.changeBg(file);
    $('#preview').css("background-image", "url('" + file + "')");
  }
}

function setPresenterFullscreen() {
  setPresenterAspectRatio(0);
  chrome.app.window.get('presenter').contentWindow.setFullscreen();
}

function updatePreview() {
  var previewWidth = $('#preview').width();
  var ratio = chrome.app.window.get('presenter').contentWindow.getWindowRatio();
  $('#preview').height(previewWidth / ratio);
}

function updatePreviewText(bitmap) {
  console.log('updating preview');
  console.log(bitmap);
  $('#previewText').attr('src', bitmap);
}
