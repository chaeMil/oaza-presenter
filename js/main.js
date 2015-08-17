var userLang;

var presenterFreezed = false;
var hideText = false;
var hideBg = false;

var currentText;
var currentVerse;
var currentTranslation;

var currentBookNum;
var currentChapterNum;
var currentVerseNum;

var currentBg;
var currentBgIsBlob;

var content = $('#content');
var numberOfDefaultImages = 35;
var globalData;

chrome.runtime.getBackgroundPage(function(bgpage) {
  globalData = bgpage.globalData;
});

function init() {
  
  chrome.runtime.getPlatformInfo(function(info) {
    globalData.os = info.os;
    globalData.appId = chrome.runtime.id;
    
    if (globalData.os == 'linux') {
      $('#closeApp').addClass('left');
      $('#toolbarMenu').addClass('linux');
    }
  });
  
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
  
  userLang = navigator.language || navigator.userLanguage;
  console.log('userLang: ' + userLang);
  
  $('#currentText').text('');
  $('#currentVerse').text('');
  $('#currentTranslation').text('');
  
  //getOption('presenterFont');
  
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
  
  //getLocalFile('en');
  
  loadBibles();
  
  setTimeout(function() {
    showLayout('#layout-images');
  }, 750);
}

function escapeHTML(input) {
  return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function loadBibles() {
  bibles = ['bibles/cze/b21/source.xml', 
            'bibles/cze/nbk/source.xml',
            'bibles/cze/cep/source.xml',
            'bibles/cze/bkr/source.xml',
            'bibles/eng/kjv/source.xml',
            'bibles/eng/rsv/source.xml'];
  
  console.log('bible books count: ' + bibles.length);
  
  for(i = 0; i < bibles.length; i++) {
    getBibleName(bibles[i]);
  }
}

function getBibleName(file) {
  $.get(file, function(xml) {
    $(xml).find('title').each(function() {
      console.log($(this).text());
      $('#bibleTranslationSelect')
        .append('<option value="' + file + '" data-translation="' + $(this).text()
          + '">' + $(this).text() + '</option>');
    });
  });
}

function getBibleBooks(file) {
  $('#bibleBookSelect').empty();
  $.get(file, function(xml) {
    $(xml).find('BIBLEBOOK').each(function() {
      $('#bibleBookSelect').append('<option value="' + $(this).attr('bnumber') + '" ' +
        'data-book="' + $(this).attr('bname') + '">' 
        + $(this).attr('bname') + '</option>');
    });
  });
}

function getBibleChapters(file, book) {
  $('#bibleChapterSelect').empty();
  $.get(file, function(xml) {
    $(xml).find("BIBLEBOOK[bnumber="+book+"] CHAPTER").each(function() {
      $('#bibleChapterSelect').append('<option value="' + $(this).attr('cnumber') + '" ' +
       'data-chapter="' + $(this).attr('cnumber') + '">'
        + $(this).attr('cnumber') + '</option>');
    });
  });
}

function getBibleVerses(file, book, chapter) {
  $('#bibleVerseSelect').empty();
  $.get(file, function(xml) {
    var verse = 1;
    $(xml).find("BIBLEBOOK[bnumber="+book+"] CHAPTER[cnumber="+chapter+"] VERS").each(function() {
      $('#bibleVerseSelect').append('<option value="' + $(this).text().replace('"', '&#34;') 
        + '" data-verse="' + verse + '">'
        + verse + ". " + $(this).text() + '</option>');
      verse++;
    });
  });
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
    
  // called when the user Cancels the dialog, for example by hitting the ESC key
  closeAppDialog.addEventListener("cancel", function(evt) {
    closeAppDialog.close("canceled");
  });
  
  //app help keyboard dialog
  var helpKeyboardDialog = document.querySelector('#helpKeyboardDialog');
  
  document.querySelector('#helpKeyboardDialogDismiss').addEventListener("click", function(evt) {
    helpKeyboardDialog.close();
  });
    
  // called when the user Cancels the dialog, for example by hitting the ESC key
  helpKeyboardDialog.addEventListener("cancel", function(evt) {
    helpKeyboardDialog.close("canceled");
  });
  
  //choose language dialog
  var chooseLanguageDialog = document.querySelector('#chooseLanguageDialog');
  
  document.querySelector('#chooseLanguageDismiss').addEventListener("click", function(evt) {
    chooseLanguageDialog.close();
  });
    
  // called when the user Cancels the dialog, for example by hitting the ESC key
  chooseLanguageDialog.addEventListener("cancel", function(evt) {
    chooseLanguageDialog.close("canceled");
  });
  
  $(document).on('keydown', function (e) {
    var key = String.fromCharCode(e.which);
    console.log(key);
    switch(key){
      case 'F':
        setPresenterFullscreen();
        break;
      case 'B':
        showLayout('#layout-bible');
        break;
      case 'O':
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
    }
  });
  
};


// app wide buttons clicks

$(document).on("click", '.language', function(event) { 
  getLocalFile($(this).data('language'));
});

$(document).on("click", '.settings', function(event) { 
  showSettingsWindow($(this).data('settings'));
});

$(document).on("click", '.help', function(event) { 
  showHelpWindow($(this).data('help'));
});

$(document).on("click", '.presenterFont', function(event) { 
  setPresenterFont($(this).data('font'), $(this).text());
  saveOption('presenterFont', $(this).data('font'));
});

$(document).on("click", '.draggablePresenterButton', function(event) { 
  togglePresenterDraggable();
});

$(document).on("click", '.setPresenterBg', function(event) { 
  setPresenterBackground($(this).data('file'), $(this).data('blob'));
});

$(document).on("click", '.setPresenterBibleVerse', function(event) { 
  setPresenterText($(this).text(), $(this).data('verse'), $(this).data('translation'));
});

$(document).on("click", '.fullscreenPresenterButton', function(event) { 
  setPresenterFullscreen();
});

$(document).on("click", '.presenterAspectRatioButton', function(event) { 
  setPresenterAspectRatio($(this).data('ratio'));
});

$(document).on("click", '.presenterSetResolution', function(event) { 
  setPresenterResolution($(this).data('res'));
});

$(document).on("click", '#hideTextButton', function(event) { 
  if (hideText) {
    presenterToggleText(false);
  } else {
    presenterToggleText(true);
  }
});

$(document).on("click", '#hideBgButton', function(event) { 
  if (hideBg) {
    presenterToggleBg(false);
  } else {
    presenterToggleBg(true);
  }
});

$(document).on("click", '#freezePresenterButton', function(event) { 
  if (presenterFreezed) {
    presenterToggleFreezed(false);
  } else {
    presenterToggleFreezed(true);
  }
});

$(document).on("click", '#closeApp', function(event) { 
  event.preventDefault();
  closeAppDialog.showModal();
});

//app functions

function showSettingsWindow(section) {
  switch(section) {
    case 'language':
      chooseLanguageDialog.showModal();
      break;
  }
}

function showHelpWindow(section) {
  switch(section) {
    case 'keyboard':
      helpKeyboardDialog.showModal();
      break;
  }
}

function addImagesLayout() {
  $.get("layouts/images.html", function(data){
      content.append(data);
      
      for (i = 1; i < numberOfDefaultImages; i++) {
        $('#imagesGrid').append('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2">'
          + '<div class="img-16-9 setPresenterBg"'
          + ' data-file="assets/defaults/images/' + i + '.jpg"'
          + ' style="background-image: url(\'assets/defaults/images/' + i + '.jpg\');"></div>');
      }
      
      document.querySelector('#importImagesFolderButton').addEventListener('click', function(evt) {
      importImages();
    });
  });
}

function addBibleLayout() {
  $.get("layouts/bible.html", function(data){
    content.append(data);
    
    $('#bibleTranslationSelect').on('change', function() {
      getBibleBooks($(this).val());
      $('#bibleBookSelect').empty();
      $('#bibleChapterSelect').empty();
      $('#bibleVerseSelect').empty();
    });
    
    $('#bibleBookSelect').on('change', function() {
      getBibleChapters($('#bibleTranslationSelect').val(), $(this).val());
      $('#bibleChapterSelect').empty();
      $('#bibleVerseSelect').empty();
      currentBookNum = $(this).data('book');
    });
    
    $('#bibleChapterSelect').on('change', function() {
      getBibleVerses(
        $('#bibleTranslationSelect').val(), 
        $('#bibleBookSelect').val(),
        $(this).val());
      currentChapterNum = $(this).val();
      $('#bibleVerseSelect').empty();
    });
    
    $('#bibleVerseSelect').on('change', function() {
      setPresenterText($(this).val(),
        $('#bibleBookSelect').find(':selected').data('book') + ' '
        + $('#bibleChapterSelect').find(':selected').data('chapter') + ':' 
        + $('#bibleVerseSelect').find(':selected').data('verse'),
        $('#bibleTranslationSelect').find(':selected').data('translation'), 
        true);
      currentVerseNum = $(this).val();
    });
    
    $('#bibleHistory').on('click', function() {
      var text = $(this).find(':selected').data('text');
      var verse = $(this).find(':selected').data('verse');
      var translation = $(this).find(':selected').data('translation');
      
      setPresenterText(text, verse, translation, false);
    });
  });
}

function showLayout(layout) {
  hideLayouts();
  $(layout).show();
}

function hideLayouts() {
  $('#layout-images').hide();
  $('#layout-bible').hide();
}

function importImages() {
  fileSystemPermission(function(e) {
    console.log('acces to filesystem is granted');
    chrome.fileSystem.chooseEntry(
      {
        type: 'openFile',
        accepts: [
          {
            extensions: ['jpg']
          }
        ],
        acceptsMultiple: true 
      },
      function (fileEntries) {
        for(i = 0; i < fileEntries.length; i++) {
          addImage(fileEntries[i]);
        }
      });
  });
}

function addImage(entry) {
  entry.file(function(file) {
    var objectURL = URL.createObjectURL(file);
    $('#imagesGrid')
      .prepend('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2">' + 
      '<div class="img-16-9 setPresenterBg" data-file="' + objectURL + '" ' +
      'data-blob="blob" ' +
      'style="background-image: url(\'' + objectURL + '\');"></div></div>');
  });
}

function fileSystemPermission(callback) {
  chrome.permissions.request({
    permissions: [
      'fileSystem',
      'fileSystem.write',
      'fileSystem.retainEntries',
      'fileSystem.directory'
    ]
  }, function(granted) {
    if (granted) {
      callback(); 
      
    } else {
      console.log('ERROR: acces to filesystem was not granted!');
    }
  });
}


//presenter functions 

function setPresenterFont(font, fontName) {
  chrome.app.window.get('presenter').contentWindow.setFont(font);
  $('#statusPresenterFont').text('aktuální font: ' + fontName);
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
      $('#statusAspectRatio').text('poměr stran: neurčen');
      break;
    case 1:
      $('#statusAspectRatio').text('poměr stran: 16:9');
      break;
    case 2:
      $('#statusAspectRatio').text('poměr stran: 4:3');
      break;
    case 3:
      $('#statusAspectRatio').text('poměr stran: 1:1');
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
    chrome.app.window.get('presenter').contentWindow.changeText(text, verse, translation);
  }
  $('#currentText').text(text);
  $('#currentVerse').text(verse);
  $('#currentTranslation').text(translation);
  
  if (saveHistory) {
    $('#bibleHistory').prepend('<option data-text="' + text + 
      '" data-verse="' + verse + '" data-translation="' + translation + '">' + 
      verse + '</option>');
  }
}

function setPresenterBackground(file, isBlob) {
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


//utils

function saveOption(key, value) {
  var sKey = key;
  var sValue = value;
  chrome.storage.local.set({key: value}, function() {
    console.log('saved: ' + sKey + ":" + sValue);
  });
}

function getOption(key) {
  chrome.storage.local.get(key, function(items) {
		console.debug(key + ' = ' + items[key]);
		console.debug(items);
  });
}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function getLocalFile(locale) {
  $.ajax({
    dataType: 'json',
    url:"local/" + locale + ".json",  
    success: function(json) {
      applyLocal(json);
    }
  });
}

function applyLocal(json) {
  $.each(json, function(index, item) {
    $('[data-localize="' + index + '"]').html(item);
  });
}

function loadImageFromUri(uri, imgElement) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    imgElement.src = window.URL.createObjectURL(xhr.response);
  };
  xhr.open('GET', uri, true);
  xhr.send();
}