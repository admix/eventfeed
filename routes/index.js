var ErrorHandler = require('./error').errorHandler;
var dbEvents = require('../app/db/events');
var dbUsers = require('../app/db/users');
var emailer = require('../app/email/email');

module.exports = exports = function(app, db, passport) {

    // Redirection from www to non-www
    // app.get('/*', function(req, res, next) {
    //   if (req.headers.host.match(/^www/) !== null ) {
    //     res.redirect(301, 'http://' + req.headers.host.replace(/^www\./, '') + req.url);
    //   } else {
    //     next();
    //   }
    // })
    // Home page
    app.get('/', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
        user : req.user, username: result // get the user out of session and pass to template
      });
    });
  //  app.get('/home', function(req, res) {
  //    res.render("index");
  //  });

	app.get('/profile', isLoggedIn, function(req, res) {
		 var resullt = null;
		 var email = null;
		// var test;
		 if(req.user.facebook.email) {
       email = req.user.facebook.email;
       result = email.split('@')[0];
     } else if(req.user.local.email) {
       email = req.user.local.email;
       result = email.split('@')[0];
     }

		 res.render('profile.ejs', {
		   user : req.user, username: result // get the user out of session and pass to template
		 });
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  	// =====================================
  	// FACEBOOK ROUTES =====================
  	// =====================================
  	// route for face book authentication and login
  	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }), function(req, res) {
      console.log("Facebook authentication");
      res.send("hello");
    });

  	// handle the callback after face book has authenticated the user
  	app.get('/auth/facebook/callback',
  		passport.authenticate('facebook', {
  			successRedirect : '/profile',   // Need to discuss what happens after user logs in
  			failureRedirect : '/'
  		}));

  	// process the login form
  	app.post('/local-login', passport.authenticate('local-login', {
  		successRedirect : '/profile', // redirect to the secure profile section
  		failureRedirect : '/', // redirect back to the signup page if there is an error
  		failureFlash : true // allow flash messages
  	}));

  	// process the signup form
  	app.post('/local-signup', passport.authenticate('local-signup', {
  		successRedirect : '/profile', // redirect to the secure profile section
  		failureRedirect : '/', // redirect back to the signup page if there is an error
  		failureFlash : true // allow flash messages
  	}));

    //GET all the events (some limit/data passed in with lat/long)
    app.get('/feed/events', function(req, res) {
      console.log("inside get all events endpoint");
      dbEvents.getAllEvents(db, function(err, msg) {
        if(err) throw err;
        res.send(JSON.stringify(msg), 200);
        res.end();
      });
    })

    //GET event by ID
    app.get('/feed/events/:id', function (req, res) {
      console.log("inside get event by id endpoint");
      var eventId = req.params.id;
      dbEvents.getEventById(db, eventId, function(err, msg) {
        if(err) console.log(err);
        res.send(msg, 200);
      })

    });

    //GET events by Name
    app.get('/feed/events/name/:eventname', function (req, res) {
      console.log("in GET by name");
      var eventName = req.params.eventname;
      dbEvents.getEventsByName(db, eventName, function(err, msg) {
        if(err) console.log(err);
        res.send(JSON.stringify(msg), 200);
        //res.end();
      })
    });

    //GET events by Date
    app.post('/feed/events/date/user', loggedIn, function (req, res) {
      console.log("in GET by date");
      var eventDate = req.body;
      var username = req.user.username;
      dbEvents.getEventsByDate(db, username, eventDate.date, function(err, msg) {
        if(err) console.log(err);
        res.send(JSON.stringify(msg), 200);
        //res.end();
      })

    });

    //GET all events for specified user (username/id provided)
    app.get('/feed/events/user/:id', function (req, res) {
      var userName = req.params.id;
      console.log("in GET by user");
      dbEvents.getEventsForUser(db, userName, function(err, msg) {
        if(err) throw err;
        console.log(msg);
        res.send(msg, 200);
        //res.end();
      })
    });

    //GET all events for logged in user (username/id provided)
    app.get('/feed/myevents', loggedIn, function (req, res) {
      console.log("in get my events for logged in user");
      var userData = "";
      if(req.user.facebook.username) {
        userData = req.user.facebook.username;
      } else if(req.user.local.username) {
        userData = req.user.local.username;
      }
      dbEvents.getEventsUserHost(db, userData, function(err, msg) {
        if(err) throw err;
        res.send(JSON.stringify(msg), 200);
        //res.end();
      })
    });

    //GET all events user is hosting (username/id provided)
    app.get('/feed/events/user/host/:id', function (req, res) {
      var hostId = req.params.id;
      console.log("Get all event user is hosting. hostid: " + hostId);
      dbEvents.getEventsUserHost(db, hostId, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
        //res.end();
      })
    });

    //GET user by ID
    app.get('/feed/users/:username', function (req, res) {
      console.log("in get user by username");
      var userName = req.params.username;
      dbUsers.getUserByUsername(db, userName, function(err, msg) {
        if(err) console.log(err);
        res.send(msg, 200);
      })

    });

    //POST save new event (data will store user-who-created-id and the event will be stored to User's-created document as well)
    app.post('/feed/event', loggedIn, function (req, res) {
      console.log("in post save new event");
      var eventData = req.body;
  	  var userData;
  	  if(req.user.facebook.username) {
        userData = req.user.facebook.username;
      } else if(req.user.local.username) {
        userData = req.user.local.username;
      }

      console.log("data received: " + eventData + " User email passed by Session: " + userData );
      dbEvents.saveNewEvent(db, eventData, userData, function(err, msg) {
        if(err) throw err;
        res.send(msg, 200);
      })
    });

    //POST save new event (Register) for particular user (userID passed in as a parameter)
    app.post('/feed/user/event/:eventId', function (req, res) {
      console.log("Registering for an event");
      var userData = "";
      var eventId = req.params.eventId;
      if(req.user.facebook.username) {
        userData = req.user.facebook.username;
      } else if(req.user.local.email) {
        userData = req.user.local.username;
      }

      dbEvents.registerForEvent(db, userData, eventId, function(err, msg) {
        if(err) console.log("Error reg");
        console.log("Success: " + msg);
        dbEvents.getEventById(db, eventId, function(err, doc) {
          if(err) console.log('Error get');
          emailer.sendEmail(req.user.facebook.email,doc);
        })

        //send email with confirmation
        res.send(msg, 200);
      })
    });

    //-------------- Handling Friends ----------------
        // Get my friends
    app.get('/friends', loggedIn,  function(req, res) {
      console.log("Get friends for loggedin user");
      var userData = "";
      if(req.user.facebook.username) {
        userData = req.user.facebook.username;
      } else if(req.user.local.email) {
        userData = req.user.local.username;
      }
      dbUsers.getFriends(db, userData, function(err, msg) {
        if(err) console.log("Error getting friends for logged in user");
        res.send(JSON.stringify(msg), 200);
      })
    })
        // get for username
    app.get('/friends/:user', function(req, res) {
      console.log("Get friends for loggedin user");
      var userData = req.params.user;
      dbUsers.getFriends(db, userData, function(err, msg) {
        if(err) console.log("Error getting friends for logged in user");
        res.send(JSON.stringify(msg), 200);
      })
    })
        // Add friend
    app.post('/friend', loggedIn, function(req, res) {
      console.log("Add friend for loggedin user");
      var userData = req.body;
      var username = req.user.username;
      console.log(userData.friend + "  " + username);
      dbUsers.addFriend(db, username, userData.friend, function(err, msg) {
        if(err) console.log("Error getting friends for logged in user");
        res.send(JSON.stringify(msg), 200);
      })
    })

    // Remove friend
    app.post('/friend/remove', loggedIn, function(req, res) {
      console.log("Add friend for loggedin user");
      var userData = req.body;
      var username = "admix.snurnikov";//req.user.username;
      console.log(userData.friend + "  " + username);
      dbUsers.removeFriend(db, username, userData.friend, function(err, msg) {
        if(err) console.log("Error getting friends for logged in user");
        res.send(JSON.stringify(msg), 200);
      })
    })
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
// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()){
    return next();
  }
  // if they aren't redirect them to the home page
  console.log("is logged in. not.")
  res.render("index.ejs");
}

function loggedIn(req, res, next) {
    if(req.user != undefined) {
      var fbUsername = req.user.facebook.username,
          localUsername = req.user.local.username;
      if(fbUsername) {
        console.log("logged in fb: " + fbUsername);
        next();
      } else if(localUsername) {
        console.log("logged in local: " + localUsername);
        next();
      }
    } else {
      console.log("not logged in");
      res.redirect('/');
    }
}
