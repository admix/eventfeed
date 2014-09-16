var ErrorHandler = require('./error').errorHandler;
var dbEvents = require('../public/js/db/events');
var dbUsers = require('../public/js/db/users');
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

    //GET all the events (some limit/data passed in with lat/long)
    app.get('/feed/events', function(req, res) {
      console.log("inside events endpoint");
      dbEvents.getAllEvents(db, function(err, msg) {
        if(err) throw err;
        res.send(JSON.stringify(msg), 200);
        res.end();
      });
    })

    //GET event by ID
    app.get('/feed/events/:id', function (req, res) {
      var eventId = req.params.id;
      dbEvents.getEventById(db, eventId, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })

    });

    //GET all events for specified user (username/id provided)
    app.get('/feed/events/userID', function (req, res) {
      dbEvents.getEventsForUser(db, userID, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //POST save new event (data will store user-who-created-id and the event will be stored to User's-created document as well)
    app.post('/feed/events', function (req, res) {
      var eventData = req.body;
      dbEvents.saveNewEvent(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //POST save new user
    app.post('/feed/user', function (req, res) {
      var userData = req.body;
      dbUsers.saveNewUser(db, userData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //POST save new event for particular user (userID passed in as a parameter)
    app.post('/feed/user/event/:id', function (req, res) {
      var userID = req.params.id;
      var eventData = req.body;
      dbEvents.saveNewEventForUser(db, userID, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //-------------- POSSIBLY NOT NEEDED --------------

    //PUT update an event for specific user by userID

    // app.put('/feed/events/:id', function (req, res) {
    //   var userID = req.params.id;
    //   var eventData = req.body;
    //   dba.updateEventByID(db, eventData, function(err, msg) {
    //     if(err) throw err;
    //     res.send(msg, 200);
    //     res.end();
    //   })
    // });

    //-------------- ^^^^^^^^^^^^^^^^^^^^ --------------

    //PUT update user by UserID
    app.put('/feed/user/:id', function (req, res) {
      var userID = req.params.id;
      var userData = req.body;
      dbUsers.updateUserByID(db, userID, userData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //PUT update an event for specific user (UserID as a parameter, EventID inside data)
    app.put('/feed/user/event/:id', function (req, res) {
      var userID = req.params.id;
      var eventData = req.body;
      dbEvents.updateEventByID(db, userID, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //-------------- POSSIBLY NOT NEEDED --------------

    //DELETE event for specific user by userID
    // app.delete('/feed/events/:id', function (req, res){
    //   var userID = req.params.id;
    //   var eventData = req.body;
    //   dba.deleteEventByID(db, userID, eventData, function(err, msg) {
    //     if(err) throw err;
    //     res.send(msg, 200);
    //     res.end();
    //   })
    //   // return ProductModel.findById(req.params.id, function (err, product) {
    //   //   return product.remove(function (err) {
    //   //     if (!err) {
    //   //       console.log("removed");
    //   //       return res.send('');
    //   //     } else {
    //   //       console.log(err);
    //   //     }
    //   //   });
    //   // });
    // });

    //-------------- ^^^^^^^^^^^^^^^^^^^^ --------------

    //DELETE user by User_ID
    app.delete('/feed/user/:id', function (req, res){
      var userID = req.params.id;
      dbUsers.deleteUserByID(db, userID, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });


    //DELETE event for specific user by User_ID
    app.delete('/feed/user/event/:id', function (req, res){
      var userID = req.params.id;
      var eventData = req.body;
      dbEvents.deleteEventByIDForUser(db, userID, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });


    // Error handling middleware
    app.use(ErrorHandler);
}
