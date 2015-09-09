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
  
  //scrolling the content to precache all default images
  $("#content").animate({scrollTop: $('#content')[0].scrollHeight}, 1000);
  setTimeout(function(e) {
    $('#content').scrollTop(0);
  }, 1100);
}

function importBgs() {
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
}

function addBg(entry) {
  entry.file(function(file) {
    var objectURL = URL.createObjectURL(file);
    $('#bgFolders').find('.active')
      .prepend('<div class="pure-u-1 pure-u-xl-1-4 pure-u-lg-1-3 pure-u-md-1-2 importedBg">' + 
      '<div class="img-16-9 setPresenterBg" data-file="' + objectURL + '" ' +
      'data-blob="blob" style="background-image: url(\'' + objectURL + '\');">' + 
      '<remove><i class="fa fa-times-circle"></i></remove></div></div>');
  });
}

function createBgFolder(folderName) {
  $('#bgFoldersBar').append('<span class="bgsFolderButton active" data-folder="'
    + folderName + '">' + folderName + '</span>');
  $('#bgFolders').append('<div class="pure-g folder" id="bgsFolder_' 
    + folderName + '"></div>');
  showBgsFolder(folderName);
  setSettings('addBgFolder', folderName, null);
}

$(document).on("click", '.bgsFolderButton', function(event) {
  showBgsFolder($(this).data('folder'));
});

function showBgsFolder(folder) {
  $('#bgFoldersBar').children().removeClass('active');
  $('[data-folder=' + folder + ']').addClass('active');
  $('#bgFolders').children().hide();
  $('#bgFolders').children().removeClass('active');
  $('#bgsFolder_' + folder).show();
  $('#bgsFolder_' + folder).addClass('active');
}

function removeBgsFolder(folder) {
  $('#bgsFolder_' + folder).remove();
  $('[data-folder="' + folder + '"]').remove();
  $('[data-folder="default"]').addClass('active');
  $('#bgsFolder_default').show();
  $('#bgsFolder_default').addClass('active');
}

$(document).on("click", '#addNewBgsFolderButton', function(event) {
  addBgFolderDialog.showModal();
  $('#addBgFolderName').val("");
});

$(document).on("contextmenu", '.bgsFolderButton[data-folder!="default"]', function(event) {
  event.preventDefault();
  var folder = $(this).data('folder');
  $('#removeBgFolderName').text(folder);
  removeBgFolderDialog.showModal();
});

$(document).on("contextmenu", '.importedBg', function(event) {
  event.preventDefault();
  $(this).children().children('remove').addClass('visible');
  var parent = $(this);
  setTimeout(function(e) {
    parent.find('remove').removeClass('visible');
  }, 2000);
});

$(document).on('click', '.importedBg remove i', function(event) {
  $(this).parent().parent().parent().remove();
});
