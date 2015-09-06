function applyLocal(json) {
  $.each(json, function(index, item) {
    $('[data-localize="' + index + '"]').html(item);
  });
}

function getLocalFile(locale) {
  $.ajax({
    dataType: 'json',
    url:"local/" + locale + ".json",  
    success: function(json) {
      applyLocal(json);
    }
  });
}