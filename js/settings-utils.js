function writeSettings(file) {
  var data = "pokusák";
  
  file.createWriter(function(writer) {
    writer.onwriteend = function(e) {
      console.log(e);
    };
    
    writer.onerror = function(e) {
      console.log(e);
    };
    
    var blob = new Blob([data]);
    
    writer.write(blob);
  });
}

function readSettings(file) {
  file.file(function(fileObject) {
    var reader = new FileReader();
    
    reader.onloadend = function(e) {
      settings = this.result;
    };
    
    reader.readAsText(fileObject);
  });
}

function clearSettings(file) {
  console.log(file);
  file.remove(
    function(e) {
      console.log("file deleted");
    }, function(e) {
      console.log(e);
    }
  );
}