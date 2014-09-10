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
    }
}
