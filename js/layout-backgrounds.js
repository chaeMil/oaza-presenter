function addBgsLayout() {
  $.get("layouts/backgrounds.html", function(data){
      content.append(data);
      
      for (i = 1; i < numberOfDefaultBgs; i++) {
        $('#bgsFolder_default').append('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2">'
          + '<div class="img-16-9 setPresenterBg"'
          + ' data-file="assets/defaults/bgs/' + i + '.jpg"'
          + ' style="background-image: url(\'assets/defaults/bgs/' + i + '.jpg\');"></div>');
      }
      
      document.querySelector('#importBgsFolderButton').addEventListener('click', function(evt) {
      importBgs();
    });
  });
}

function importBgs() {
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
          addBg(fileEntries[i]);
        }
      });
  });
}

function addBg(entry) {
  entry.file(function(file) {
    var objectURL = URL.createObjectURL(file);
    $('#bgFolders').find('.active')
      .prepend('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2 importedBg">' + 
      '<div class="img-16-9 setPresenterBg" data-file="' + objectURL + '" ' +
      'data-blob="blob" style="background-image: url(\'' + objectURL + '\');"></div>' +
      '<remove><i class="fa fa-times-circle"></i></remove></div>');
  });
}