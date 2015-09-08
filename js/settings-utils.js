function writeSettings() {
  settings.createWriter(function(writer) {
    writer.onwriteend = function(e) {
      console.log("settings saved");
    };
    
    writer.onerror = function(e) {
      console.log("error when saving settings");
    };
    
    var blob = new Blob(["pokusák: 15"]);
    
    writer.write(blob);
  });
}