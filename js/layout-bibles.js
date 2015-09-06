function addBibleLayout() {
  $.get("layouts/bible.html", function(data){
    content.append(data);
    
    $('#bibleTranslationSelect').on('change', function() {
      getBibleBooks($(this).val());
      
      $('#bibleBookSelect').empty();
      $('#bibleChapterSelect').empty();
      $('#bibleVerseSelect').empty();
      
      getBibleChapters($(this).val(), currentBookNum);
      getBibleVerses($(this).val(), currentBookNum, currentChapterNum);
      
      if(currentVerseNum !== 0) {
        var select = $('#bibleVerseSelect').toArray()[0];

        getBibleVerseAndDisplay($('#bibleTranslationSelect').val(),
          currentBookNum,
          currentChapterNum,
          currentVerseNum);
      }
    });
    
    $('#bibleBookSelect').on('change', function() {
      getBibleChapters($('#bibleTranslationSelect').val(), $(this).val());
      $('#bibleChapterSelect').empty();
      $('#bibleVerseSelect').empty();
      currentBookNum = $(this).data('book');
      currentBook = $(this).find(':selected').text();
    });
    
    $('#bibleChapterSelect').on('change', function() {
      getBibleVerses(
        $('#bibleTranslationSelect').val(), 
        $('#bibleBookSelect').val(),
        $(this).val());
      currentChapterNum = $(this).val();
      currentChapter = $(this).find(':selected').text();
      $('#bibleVerseSelect').empty();
    });
    
    $('#bibleVerseSelect').on('change', function() {
      setPresenterText($(this).find(':selected').data('text'),
        currentBook + ' ' + currentChapter + ':' + $(this).find(':selected').val(),
        $('#bibleTranslationSelect').find(':selected').data('translation'), 
        true);
        
      currentVerseNum = $(this).find(':selected').data('vnumber');
      currentBookNum = $(this).find(':selected').data('bnumber');
      currentChapterNum = $(this).find(':selected').data('cnumber');
    });
    
    $('#bibleHistory').on('click', function() {
      var text = $(this).find(':selected').data('text');
      var verse = $(this).find(':selected').data('verse');
      var translation = $(this).find(':selected').data('translation');
      
      setPresenterText(text, verse, translation, false);
    });
  });
}