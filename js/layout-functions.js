function createBgFolder(folderName) {
  $('#bgFoldersBar').append('<span class="bgsFolderButton active" data-folder="'
    + folderName + '">' + folderName + '</span>');
  $('#bgFolders').append('<div class="pure-g folder" id="bgsFolder_' 
    + folderName + '"></div>');
  showBgsFolder(folderName);
}

function showBgsFolder(folder) {
  $('#bgFoldersBar').children().removeClass('active');
  $('[data-folder=' + folder + ']').addClass('active');
  $('#bgFolders').children().hide();
  $('#bgFolders').children().removeClass('active');
  $('#bgsFolder_' + folder).show();
  $('#bgsFolder_' + folder).addClass('active');
}

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
}

function hideLayouts() {
  $('#layout-backgrounds').hide();
  $('#layout-bible').hide();
}