function addSongsLayout() {
  $.get("layouts/songs.html", function(data){
    content.append(data);
    
    $('#songsFolders').jstree({
      'core' : {
        'data' : [
          { "text" : "Root node", "children" : [
              { "text" : "Child node 1" },
              { "text" : "Child node 2" }
            ]
          }
        ]
      }
    });
    
  });
}