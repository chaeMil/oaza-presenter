function escapeHTML(input) {
  return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function loadBibles() {
  bibles = ['bibles/cze/cep/source.xml',
            'bibles/cze/b21/source.xml', 
            'bibles/cze/bkr/source.xml',
            'bibles/cze/nbk/source.xml',
            'bibles/eng/kjv/source.xml',
            'bibles/eng/rsv/source.xml'];
  
  console.log('bible books count: ' + bibles.length);
  
  for(i = 0; i < bibles.length; i++) {
    getBibleName(bibles[i]);
  }
}

function getBibleName(file) {
  $.get(file, function(xml) {
    $(xml).find('title').each(function() {
      console.log($(this).text());
      $('#bibleTranslationSelect')
        .append('<option value="' + file + '" data-translation="' + $(this).text()
          + '">' + $(this).text() + '</option>');
    });
  });
  
  var bibles = $("#bibleTranslationSelect");
  
  bibles.sort(function(a,b) {
      if (a.text > b.text) return 1;
      else if (a.text < b.text) return -1;
      else return 0;
  });
  
  $("#bibleTranslationSelect").empty().append(bibles);
}

function getBibleBooks(file) {
  $('#bibleBookSelect').empty();
  $.get(file, function(xml) {
    $(xml).find('BIBLEBOOK').each(function() {
      $('#bibleBookSelect').append('<option value="' + $(this).attr('bnumber') + '" ' +
        'data-book="' + $(this).attr('bsname') + '">' 
        + $(this).attr('bsname') + '</option>');
    });
  });
}

function getBibleChapters(count) {
  $('#bibleChapterSelect').empty();
  for (var n = 1; n <= count; ++ n) {
    $('#bibleChapterSelect').append('<option value="' + n + '" ' +
      'data-chapter="' + n + '">'
      + n + '</option>');
  }
}

function getBibleVerses(file, book, chapter) {
  $('#bibleVerseSelect').empty();
  $.get(file, function(xml) {
    var verse = 1;
    $(xml).find("BIBLEBOOK[bnumber="+book+"] CHAPTER[cnumber="+chapter+"] VERS").each(function() {
      var text = $(this).text().replace(/"/g, '&&&');
      $('#bibleVerseSelect').append('<option value="' + verse
        + '" data-text="' + text
        + '" data-vnumber="' + verse
        + '" data-bnumber="' + book
        + '" data-cnumber="' + chapter + '">'
        + verse + ". " + $(this).text() + '</option>');
      verse++;
    });
  });
}

function getBibleVerseAndDisplay(file, book, chapter, verse) {
  console.log('file:'+file+' book:'+book+' chapter:'+chapter+' verse:'+verse);
  
  $('#bibleVerseSelect').empty();
  $.get(file, function(xml) {
    $(xml).find("BIBLEBOOK[bnumber="+book+"] CHAPTER[cnumber="+chapter+"] VERS[vnumber="+verse+"]").each(function() {
      var verseText = $(this).text().replace(/"/g, '&&&');
      setPresenterText(verseText,
        currentBook + ' ' + currentChapter + ':' + currentVerseNum,
        $('#bibleTranslationSelect').find(':selected').data('translation'), 
        true);
    });
  });
}