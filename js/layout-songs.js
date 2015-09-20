function addSongsLayout() {
  $.get("layouts/songs.html", function(data){
    content.append(data);
    
    $('#addSong').on('click', function() {
      addSongDialog.showModal();
    });
    
    $('#deleteSong').on('click', function() {
      deleteSong();
    });
    
    parseSongs(function(songs) {
      $.each(songs, function(index, value) {
        console.dir(value);
        $('#songSelection').append('<option data-content="' + value['content']
            + '">' + value['name'] + '</option>');
      });
    });
    
  });
}

function addSong(name) {
  $('#songSelection').append('<option data-name="'
      + name.replace(/&&&/g, '"') + '">' + name.replace(/&&&/g, '"') + '</option>');
      
  songs('add', {'name': name, 'content': ''}, null);
}

function deleteSong() {
  var name = $('#songSelection').find(':selected').text();
  var content = $('#songSelection').find(':selected').data('content');
  
  songs('delete', {'name': name, 'content': content}, null);
  
  $('#songSelection').find(':selected').remove();
}

function parseSongs(callback) {
  getSongs(function(songs) {
    if (callback !== null) {
      callback(songs);
    }
  });
}