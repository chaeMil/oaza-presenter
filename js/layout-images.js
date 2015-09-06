function addImagesLayout() {
  $.get("layouts/images.html", function(data){
      content.append(data);
      
      for (i = 1; i < numberOfDefaultImages; i++) {
        $('#imagesFolder_default').append('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2">'
          + '<div class="img-16-9 setPresenterBg"'
          + ' data-file="assets/defaults/images/' + i + '.jpg"'
          + ' style="background-image: url(\'assets/defaults/images/' + i + '.jpg\');"></div>');
      }
      
      document.querySelector('#importImagesFolderButton').addEventListener('click', function(evt) {
      importImages();
    });
  });
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
    $('#imageFolders').find('.active')
      .prepend('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2 importedImage">' + 
      '<div class="img-16-9 setPresenterBg" data-file="' + objectURL + '" ' +
      'data-blob="blob" style="background-image: url(\'' + objectURL + '\');"></div>' +
      '<remove><i class="fa fa-times-circle"></i></remove></div>');
  });
}