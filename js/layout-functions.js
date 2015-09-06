function createImageFolder(folderName) {
  $('#imageFoldersBar').append('<span class="imagesFolderButton active" data-folder="'
    + folderName + '">' + folderName + '</span>');
  $('#imageFolders').append('<div class="pure-g folder" id="imagesFolder_' 
    + folderName + '"></div>');
  showImagesFolder(folderName);
}

function showImagesFolder(folder) {
  $('#imageFoldersBar').children().removeClass('active');
  $('[data-folder=' + folder + ']').addClass('active');
  $('#imageFolders').children().hide();
  $('#imageFolders').children().removeClass('active');
  $('#imagesFolder_' + folder).show();
  $('#imagesFolder_' + folder).addClass('active');
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
  $('#layout-images').hide();
  $('#layout-bible').hide();
}