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

function showLayout(layout) {
  hideLayouts();
  $(layout).show();
  
  switch(layout) {
    case '#layout-bible':
      $('#bibleVerseSelect').focus();
  }
}

function hideLayouts() {
  $('#layout-backgrounds').hide();
  $('#layout-bible').hide();
}