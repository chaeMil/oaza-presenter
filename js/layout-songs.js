function addSongsLayout() {
  $.get("layouts/songs.html", function(data){
    content.append(data);
    
    $('#addSong').on('click', function() {
      addSongDialog.showModal();
    });
    
  });
}