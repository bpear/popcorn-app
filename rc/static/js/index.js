;(function(){

window.socket = io.connect();

var $main   = $('#main'),
    $search = $('#search');

// Show the detail overlay
var $overlay = $('#overlay');
var $info = $overlay.find('.info');

function bindListeners() {
  /* Search */
  $search.keypress(function(e) {
    if (e.which == 13) {
      $main.empty();
      socket.emit('search', $search.val());
      $search.blur();
      e.preventDefault();
    }
  });

  /* WebSocket events */
  socket.on('movie', function(movie){
    var $img = $('<img />').attr('src', movie.bigImage).data(movie);

    $main.append($img);

    $img.on('click', $main, function(){
      showOverlay($img.data());
    });
  });
}

function showOverlay(movie) {

    // Set background image
    $overlay.css({ 'background-image': 'url(' + movie.backdrop + ')'});

    var info = '<h1>' + movie.title + '</h1>' +
      '<h3>' + movie.year + ' &bull; ' + movie.runtime + 'min</h3>' +
      '<p class="description">' + movie.synopsis + '</p>' +
      '<a class="back" href="javascript:void(0);">BACK</a><a class="watch-now" href="javascript:void(0);">WATCH NOW</a>';

    $info.html(info);
    $overlay.show();

    $info.find('.watch-now').click(function(){
      socket.emit('play', movie);
      event.preventDefault();
    });

    $info.find('.back').click(function() {
      closeOverlay();
      event.preventDefault();
    });
}

function closeOverlay() {
  $overlay.hide();
  $info.find('.back').off();
  $info.find('.watch-now').off();
}

bindListeners();

})();
