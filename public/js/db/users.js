module.exports = {
    getAllUsers: function(db, callback) {
      "use strict";
      var users = db.collection("users");

      users.find({},{"_id": 0}).toArray(function(err, doc) {
        if (err) {
          console.log(err);
          callback(err);
        }
        console.log(doc);
        callback(null, doc);
      });

    },
    getUserById: function(db, userId, callback) {
      "use strict";
      var users = db.collection("users");

      users.findOne({'id':parseInt(userId)}, function(err, doc) {
        if(err) console.log(err.message);
        console.log(doc.name);
        callback(null, doc.name);
        //return false;
      });
    },
    saveNewUser: function(db, user, callback) {
      "use strict";
      var users = db.collection("users");

    },
    updateUserByID: function(db, user, callback) {
      "use strict";
      var users = db.collection("users");
    },
    deleteUserByID: function(db, user, callback) {
      "use strict";
      var users = db.collection("users");
    }
}
