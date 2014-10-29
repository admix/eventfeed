module.exports = {
      //getting all the events
    getAllEvents: function(db, callback) {
      "use strict";
      var events = db.collection("events");

      events.find({},{"_id": 0}).toArray(function(err, doc) {
        if (err) {
          console.log(err);
          callback(err);
			  }
        console.log(doc);
        callback(null, doc);
      });

    }, //getting event by ID
    getEventById: function(db, eventId, callback) {
      "use strict";
      var events = db.collection("events");

      events.findOne({'id':parseInt(eventId)}, function(err, doc) {
        if(err || doc == null) {
          console.log(err);
          callback(null, "Not found!");
        } else {
          console.log("Event: " + doc);
          callback(null, doc);
        }
      });
    },
    getEventsByName: function(db, eventName, callback) {
      "use strict";
      var events = db.collection("events");
      events.find({'name':new RegExp(eventName, 'i')}).toArray(function(err, doc) {
        if(err || doc == null) {
          console.log(err);
          callback(null, "Not found!");
        }
        console.log(doc);
        callback(null, doc);
      });
    }, //get events for specific user
    getEventsForUser: function(db, userId, callback) {
      "use strict";
      var events = db.collection("events");
      events.find({'users.username':userId}).toArray(function(err, doc) {
        if(err || doc == null) {
          console.log(err);
          callback(null, "Not found!");
        }
        console.log(doc);
        callback(null, doc);
      });
    }, //get events of logged in user
    getEventsUserHost: function(db, hostId, callback) {
      "use strict";
      var events = db.collection("events");
      console.log("in getting events user is hosting");
      events.find({'createdByUsername':hostId}).toArray(function(err, doc) {
        if(err || doc == null) {
          console.log(err);
          callback(null, "Not found!");
        }
        callback(null, doc);
      });
    }, //adding new event
    saveNewEvent: function(db, event, username, callback) {
      "use strict";
      var events = db.collection("events");
      console.log("Processing new event");

      getNextSequence(db, "eventid", function(err, msg) {
        event.id = msg.seq;
        event.createdByUsername = username;
        event.users = [];
        console.log("ID to be saved: " + event.id);
        events.insert(event, function(err, doc) {
          if(err) throw err;

          console.log("New event has been added to the DB: " + JSON.stringify(doc));
          callback(null, doc[0]);
        });
      });
    }, //adding new event for specific user
    registerForEvent: function(db, userData, eventId, callback) {
      "use strict";
      var events = db.collection("events");
      var users = db.collection("users");
      console.log(userData + " is registering for " + eventId);
      events.update({"id":parseInt(eventId)},{"$addToSet":{"users":{"username": userData}}}, function(err, doc) {
        if(err) {
          callback(null);
        }
        console.log("return: ");
        console.log(doc);
        callback(null, doc);
      })


    }, //updating event by ID
    updateEventByID: function(db, userID, event, callback) {
      "use strict";
      var events = db.collection("events");
      var users = db.collection("users");

    }, //deleting event by ID
    deleteEventByIDForUser: function(db, userID, event, callback) {
      "use strict";
      var events = db.collection("events");
      var users = db.collection("users");

    }
}

function getNextSequence(db, name, callback) {
  console.log("Getting the latest sequence");
  var counters = db.collection("counters");

  counters.findAndModify(
    {_id: name}, // query
    [['_id','asc']],  // sort order
    {$inc: {seq: 1}}, // replacement, replaces only the field "hi"
    {new: true}, // options
    function(err, object) {
      if (err){
          console.warn(err.message);  // returns error if no matching object found
      }else{
          console.log("incremented id: " + object.seq);
          callback(null, object);
      }
    });
}
