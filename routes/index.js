var ErrorHandler = require('./error').errorHandler;
var dba = require('../public/js/db/events');
module.exports = exports = function(app, db) {

    // Redirection from www to non-www
    app.get('/*', function(req, res, next) {
      if (req.headers.host.match(/^www/) !== null ) {
        res.redirect(301, 'http://' + req.headers.host.replace(/^www\./, '') + req.url);
      } else {
        next();
      }
    })
    // Home page
    app.get('/', function(req, res) {
      res.render("main.html");
    });

    app.get('/events', function(req, res) {
      console.log("inside events endpoint");
      dba.getAllEvents(db, function(err, msg) {
        if(err) throw err;
        res.send(JSON.stringify(msg), 200);
        res.end();
      });
    })

    app.get('/events/:id', function (req, res) {
      var eventId = req.params.id;
      dba.getEventById(db, eventId, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })

  });
    // Error handling middleware
    app.use(ErrorHandler);
}
