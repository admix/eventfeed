var ErrorHandler = require('./error').errorHandler;

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

    // Error handling middleware
    app.use(ErrorHandler);
}
