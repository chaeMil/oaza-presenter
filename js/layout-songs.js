function addSongsLayout() {
  $.get("layouts/songs.html", function(data){
    content.append(data);
    
    $('#addSong').on('click', function() {
      addSongDialog.showModal();
    });
    
  });
}

function addSong(name) {
  $('#songSelection').append('<option data-name="'
      + name.replace(/&&&/g, '"') + '">' + name.replace(/&&&/g, '"') + '</option>');
      
  songs('add', {'name': name, 'content': ''}, null);
}