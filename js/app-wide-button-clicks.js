// app wide buttons clicks

$(document).on("click", '.bgsFolderButton', function(event) {
  showBgsFolder($(this).data('folder'));
});

$(document).on("click", '.presenterFontBigger', function(event) {
  setPresenterFontSize(10);
});

$(document).on("click", '.presenterFontSizeReset', function(event) {
  setPresenterFontSize(0);
});

$(document).on("click", '.presenterFontSmaller', function(event) {
  setPresenterFontSize(-10);
});

$(document).on("click", '.presenterOpen', function(event) {
  openPresenterWindow();
});

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
  $('.fonts-menu').children('li').each(function () {
    $(this).removeClass('active');
  });
  $(this).parent().addClass('active');
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