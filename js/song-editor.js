function init() {
  
  chrome.runtime.getPlatformInfo(function(info) {
    var os = info.os;
    
    if (os == 'linux' || os == 'mac') {
      $('#closeEditor').addClass('left');
      $('#toolbarMenu').addClass('linux');
    }
  });
}

window.addEventListener('load', function() {
  
  init();
  
  $('#closeEditor').on('click', function() {
    window.close();
  });
  
});