
  //app close dialog
  var closeAppDialog = document.querySelector('#closeAppDialog');

  document.querySelector('#closeAppDialogYes').addEventListener("click", function(evt) {
    window.close();
  });
  
  document.querySelector('#closeAppDialogNo').addEventListener("click", function(evt) {
    closeAppDialog.close();
  });
    
  closeAppDialog.addEventListener("cancel", function(evt) {
    closeAppDialog.close("canceled");
  });
  
  
  
  
  //app help keyboard dialog
  var helpKeyboardDialog = document.querySelector('#helpKeyboardDialog');
  
  document.querySelector('#helpKeyboardDialogDismiss').addEventListener("click", function(evt) {
    helpKeyboardDialog.close();
  });
    
  helpKeyboardDialog.addEventListener("cancel", function(evt) {
    helpKeyboardDialog.close("canceled");
  });
  
  
  
  
  //choose language dialog
  var chooseLanguageDialog = document.querySelector('#chooseLanguageDialog');
  
  document.querySelector('#chooseLanguageDismiss').addEventListener("click", function(evt) {
    chooseLanguageDialog.close();
  });
    
  chooseLanguageDialog.addEventListener("cancel", function(evt) {
    chooseLanguageDialog.close("canceled");
  });
  
  
  
  
  //add image folder dialog
  var addBgFolderDialog = document.querySelector('#addBgFolderDialog');
  
  document.querySelector('#addBgFolderDismiss').addEventListener("click", function(evt) {
    addBgFolderDialog.close();
  });
  
  document.querySelector('#addBgFolderAdd').addEventListener("click", function(evt) {
    createBgFolder($('#addBgFolderName').val());
    $('#addBgFolderName').val();
    addBgFolderDialog.close();
  });
    
  addBgFolderDialog.addEventListener("cancel", function(evt) {
    addBgFolderDialog.close("canceled");
  });
  
  
  
  
  //add image folder dialog
  var removeBgFolderDialog = document.querySelector('#removeBgFolderDialog');
  
  document.querySelector('#removeBgFolderDismiss').addEventListener("click", function(evt) {
    removeBgFolderDialog.close();
  });
  
  document.querySelector('#removeBgFolderRemove').addEventListener("click", function(evt) {
    removeBgsFolder($('#removeBgFolderName').text());
    $('#removeBgFolderName').text('');
    removeBgFolderDialog.close();
  });
    
  removeBgFolderDialog.addEventListener("cancel", function(evt) {
    removeBgFolderDialog.close("canceled");
  });
  
  
  
  //add song dialog
  var addSongDialog = document.querySelector('#addSongDialog');
  
  document.querySelector('#addSongDismiss').addEventListener("click", function(evt) {
    addSongDialog.close();
  });
  
  document.querySelector('#addSongAdd').addEventListener("click", function(evt) {
    
    addSongDialog.close();
  });
    
  addSongDialog.addEventListener("cancel", function(evt) {
    addSongDialog.close("canceled");
  });
  
  
