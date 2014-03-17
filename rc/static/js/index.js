;(function(){

window.socket = io.connect();

var $main   = $('#main'),
    $search = $('#search');

$search.keypress(function(e) {
  if (e.which == 13) {
    $main.empty();
    socket.emit('search', $search.val());
    $search.blur();
    e.preventDefault();
  }
});

socket.on('movie', function(movie){

  var $img = $('<img />').attr('src', movie.bigImage).data(movie);

  $main.append($img);

  $img.on('click', $main, function(){
    showOverlay($img.data());
  });

});

// Show the detail overlay
var $overlay = $('#overlay');
var $info = $overlay.find('.info');

function showOverlay(movie) {
    $overlay.css({ 'background': ' rgba(0,0,0,.1) url(' + movie.backdrop + ') no-repeat center center fixed'});

    var info = '<h1>'+movie.title+'</h1>' +
      '<h3>' + movie.year + ' ● ' + movie.runtime + 'min</h3>' +
      '<p>' + movie.synopsis + '</p>' +
      '<a href="#">WATCH NOW</a>';

    $('#main').css('overflow', 'hidden');
    $info.html(info);
    $overlay.show();

    $info.find('a').click(function(){
      socket.emit('play', movie);
    });
}

})();
