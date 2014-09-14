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

    //GET all the events (some limit/data passed in with lat/long)
    app.get('/events', function(req, res) {
      console.log("inside events endpoint");
      dba.getAllEvents(db, function(err, msg) {
        if(err) throw err;
        res.send(JSON.stringify(msg), 200);
        res.end();
      });
    })

    //GET event by ID
    app.get('/events/:id', function (req, res) {
      var eventId = req.params.id;
      dba.getEventById(db, eventId, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })

    });

    //GET all events for specified user (username/id provided)
    app.get('/events/userID', function (req, res) {
      dba.getEventsForUser(db, userID, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //POST save new event (data will store user-who-created-id and the event will be stored to User's-created document as well)
    app.post('/events', function (req, res) {
      dba.saveNewEvent(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //POST save new user
    app.post('/user', function (req, res) {
      dba.saveNewUser(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //POST save new event for particular user (userID passed in as a parameter)
    app.post('/user/event/:id', function (req, res) {
      dba.saveNewEventForUser(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //PUT update an event by EventID
    app.put('/events/:id', function (req, res) {
      dba.updateEventByID(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });


    //PUT update user by UserID
    app.put('/user/:id', function (req, res) {
      dba.updateUserByID(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //PUT update an event for specific user (UserID as a parameter, EventID inside data)
    app.put('/user/event/:id', function (req, res) {
      dba.updateEventByID(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });

    //DELETE event by Event_ID
    app.delete('/events/:id', function (req, res){
      dba.deleteEventByID(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
      // return ProductModel.findById(req.params.id, function (err, product) {
      //   return product.remove(function (err) {
      //     if (!err) {
      //       console.log("removed");
      //       return res.send('');
      //     } else {
      //       console.log(err);
      //     }
      //   });
      // });
    });


    //DELETE user by Event_ID
    app.delete('/user/:id', function (req, res){
      dba.deleteUserByID(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });


    //DELETE event for specific user by User_ID
    app.delete('/user/event/:id', function (req, res){
      dba.deleteEventByIDForUser(db, eventData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        res.end();
      })
    });


    // Error handling middleware
    app.use(ErrorHandler);
}
