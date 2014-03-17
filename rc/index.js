
/**
 * Module dependencies
 */
var express = require('express'),
    app = express(),
    sio = require('socket.io'),
    port = parseInt(process.env.PORT, 10) || 8889;

/* Express */
app.get('/', function(req, res) {
  res.redirect('/index.html');
});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(process.cwd() + '/rc/static'));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(app.router);
});
var server = app.listen(port);

/* Socket.IO */
var io = sio.listen(server);

io.set('log level', 0);

io.sockets.on('connection', function(socket){

  var Scrapper = App.currentScrapper;

  var movies = new Scrapper([], {
      keywords: null,
      genre: null
  });

  movies.fetch();

  movies.on('add', function(movie){
    socket.emit('movie', movie);
  });

  socket.on('play', function(data){
    var movie = movies.find(function(model) { return model.get('torrent') === data.torrent; });
    console.log(movie.get('torrent'));
    App.sidebar.model = movie;
    App.sidebar.play($.Event('click'));

    if (!win.isFullscreen) {
      win.toggleFullscreen();
    }
  });

});
