function keyControls() {
  $(document).on('keydown', function (e) {
    var key = String.fromCharCode(e.which);
    
    if (!$("input").is(":focus")) {
      switch(key){
        case 'F':
          setPresenterFullscreen();
          break;
        case 'B':
          showLayout('#layout-bible');
          break;
        case 'P':
          showLayout('#layout-backgrounds');
          break;
        case 'G':
          togglePresenterDraggable();
          break;
        case 'N':
          if (hideText) {
            presenterToggleText(false);
          } else {
            presenterToggleText(true);
          }
          break;
        case 'M':
          if (hideBg) {
            presenterToggleBg(false);
          } else {
            presenterToggleBg(true);
          }
          break;
        case 'Z':
          if (presenterFreezed) {
            presenterToggleFreezed(false);
          } else {
            presenterToggleFreezed(true);
          }
          break;
        case 'Q':
          setPresenterFontSize(-10);
          break;
        case 'W':
          setPresenterFontSize(0);
          break;
        case 'E':
          setPresenterFontSize(10);
          break;
        case 37: // left
          break;
  
        case 38: // up
          break;
  
        case 39: // right
          break;
  
        case 40: // down
          if($('#bibleVerseSelect').is(':focus')) {
            
            var maxVerse = $('#bibleVerseSelect option:last').val();
            var currentVerse = currentVerseNum;
          }
          break;
      }
    }
  });
}