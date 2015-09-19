function addSongsLayout() {
  $.get("layouts/songs.html", function(data){
    content.append(data);
    
    
  });
}