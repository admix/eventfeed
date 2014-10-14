var http = require("http"),
    express = require("express"),
    MongoClient = require("mongodb").MongoClient,
    Server = require("mongodb").Server,
    habitat = require("habitat"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cons = require("consolidate"),
    swig = require("swig"),
    validator = require("validator");
    compression = require('compression');

habitat.load();
var env = new habitat(),
    app = express(),
    server = http.createServer(app),
    port = Number(env.get("PORT") || 8080);

var routes = require("./routes");

// starting app server, the last function to call
MongoClient.connect('mongodb://localhost:27017/eventfeed', function(err, db) {
  "use strict";
  if(err) throw err;

  // Register our templating engine
  app.engine('html', cons.swig);
  app.set('view engine', 'html');
  app.use(compression()); //use compression
  app.engine('html', require('ejs').renderFile);
  // Express middleware to populate 'req.cookies' so we can access cookies
  app.use(express.cookieParser());

  // Express middleware to populate 'req.body' so we can access POST variables
  app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(express.static(__dirname + "/public"));

  routes(app, db);

  app.use(function(err, req, res, next) {
    // if error occurs
    res.send(500, { error: 'Sorry something bad happened!' });
  });

  app.listen(port);

  console.log('Express server listening on port ' + port);
});
