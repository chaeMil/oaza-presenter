function keyControls() {
  $(document).on('keydown', function (e) {
    var key = String.fromCharCode(e.which);
    
    if (!$("input").is(":focus")) {
      switch(key){
        case 'F':
          e.preventDefault();
          setPresenterFullscreen();
          break;
        case 'B':
          e.preventDefault();
          showLayout('#layout-bible');
          break;
        case 'P':
          e.preventDefault();
          showLayout('#layout-backgrounds');
          break;
        case 'G':
          e.preventDefault();
          togglePresenterDraggable();
          break;
        case 'N':
          e.preventDefault();
          if (hideText) {
            presenterToggleText(false);
          } else {
            presenterToggleText(true);
          }
          break;
        case 'M':
          e.preventDefault();
          if (hideBg) {
            presenterToggleBg(false);
          } else {
            presenterToggleBg(true);
          }
          break;
        case 'Z':
          e.preventDefault();
          if (presenterFreezed) {
            presenterToggleFreezed(false);
          } else {
            presenterToggleFreezed(true);
          }
          break;
        case 'Q':
          e.preventDefault();
          setPresenterFontSize(-10);
          break;
        case 'W':
          e.preventDefault();
          setPresenterFontSize(0);
          break;
        case 'E':
          e.preventDefault();
          setPresenterFontSize(10);
          break;
        case 'S':
          e.preventDefault();
          showLayout('#layout-songs');
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
          
          if($('#bibleHistory').is(':focus')) {
            $('#bibleTranslationSelect').focus();
            break;
          }
          break;
        case '&': // up
          break;
        case "'": // right
          if($('#bibleTranslationSelect').is(':focus')) {
            $('#bibleHistory').focus();
            break;
          }
        
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