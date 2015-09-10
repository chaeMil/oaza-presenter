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
        case '%': // left
          if($('#bibleVerseSelect').is(':focus')) {
            $('#bibleChapterSelect').focus();
            break;
          }
          
          if($('#bibleChapterSelect').is(':focus')) {
            $('#bibleBookSelect').focus();
            break;
          }
          
          if($('#bibleBookSelect').is(':focus')) {
            $('#bibleHistory').focus();
            break;
          }
          break;
        case '&': // up
          break;
        case "'": // right
          if($('#bibleHistory').is(':focus')) {
            $('#bibleBookSelect').focus();
            break;
          }
          
          if($('#bibleBookSelect').is(':focus')) {
            $('#bibleChapterSelect').focus();
            break;
          }
          
          if($('#bibleChapterSelect').is(':focus')) {
            $('#bibleVerseSelect').focus();
            break;
          }
          break;
        case '(': // down
          if($('#bibleVerseSelect').is(':focus')) {
            
            var maxVerse = $('#bibleVerseSelect option:last').val();
            
            console.log('maxVerse: ' + maxVerse + ' currentVerse: ' + currentVerseNum);
            
            if(maxVerse == currentVerseNum) {
              currentVerseNum = 1;
              currentChapterNum += 1;
              getBibleVerseAndDisplay($('#bibleTranslationSelect').val(), 
                currentBookNum, 
                currentChapterNum, 
                currentVerseNum);
                
              getBibleVerses($('#bibleTranslationSelect').val(),
                currentBookNum,
                currentChapterNum);
            }
            
          }
          break;
      }
    }
  });
}