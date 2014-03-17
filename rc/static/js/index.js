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
    $overlay.css({ 'background': ' rgba(0,0,0,.1) url(' + movie.backdrop + ') no-repeat center center'});

    var info = '<h1>' + movie.title + '</h1>' +
      '<h3>' + movie.year + ' &bull; ' + movie.runtime + 'min</h3>' +
      '<p>' + movie.synopsis + '</p>' +
      '<a class="back" href="#">BACK</a><a class="watch-now" href="#">WATCH NOW</a>';

    $info.html(info);
    $overlay.show();

    $info.find('.watch-now').click(function(){
      socket.emit('play', movie);
    });

    $info.find('.back').click(function() {
      closeOverlay();
    });
}

function closeOverlay() {
  $overlay.hide();
  $info.find('.back').off();
  $info.find('.watch-now').off();
}

bindListeners();

})();
