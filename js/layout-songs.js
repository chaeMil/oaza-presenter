function addSongsLayout() {
  $.get("layouts/songs.html", function(data){
    content.append(data);
    
    $('#addSong').on('click', function() {
      addSongDialog.showModal();
    });
    
    parseSongs(function(songs) {
      $.each(songs, function(index, value) {
        console.dir(value);
        $('#songSelection').append('<option>' + value['name'] + '</option>');
      });
    });
    
  });
}

function addSong(name) {
  $('#songSelection').append('<option data-name="'
      + name.replace(/&&&/g, '"') + '">' + name.replace(/&&&/g, '"') + '</option>');
      
  songs('add', {'name': name, 'content': ''}, null);
}

function parseSongs(callback) {
  getSongs(function(songs) {
    if (callback !== null) {
      callback(songs);
    }
  });
}