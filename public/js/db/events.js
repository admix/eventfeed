module.exports = {
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

    },
    getEventById: function(db, eventId, callback) {
      "use strict";
      var events = db.collection("events");

      events.findOne({'id':parseInt(eventId)}, function(err, doc) {
        if(err) console.log(err.message);
        console.log(doc.name);
        callback(null, doc.name);
        //return false;
      });
    },
    saveNewEvent: function(db, event, callback) {
      "use strict";
      var events = db.collection("events");

      events.insert(event, function(err, doc) {
        if(err) throw err;
        console.log("New event has been added to the DB as: " + doc);
        callback(null, doc);
      });
    },
    saveNewEventForUser: function(db, event, callback) {
      "use strict";
      var events = db.collection("events");
      var users = db.collection("users");

      //saves new event to user document
    },
    updateEventByID: function(db, userID, event, callback) {
      "use strict";
      var events = db.collection("events");
      var users = db.collection("users");

    },
    deleteEventByIDForUser: function(db, userID, event, callback) {
      "use strict";
      var events = db.collection("events");
      var users = db.collection("users");

    }
}
