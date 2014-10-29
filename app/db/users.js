module.exports = {
      //getting all the users
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

    }, //getting user by ID
    getUserByUsername: function(db, userName, callback) {
      "use strict";
      var users = db.collection("users");
      console.log("Getting usee by username: " + userName);
      users.findOne({'facebook.username':userName},{"facebook.token":0,"facebook.id":0,"_id":0,"__v":0}, function(err, doc) {
        if(err) console.log(err.message);
        console.log(doc);
        callback(null, doc);
        //return false;
      });
    }, //adding new user
    saveNewUser: function(db, user, callback) {
      "use strict";
      var users = db.collection("users");

      console.log("Processing new user: " + user.username);
      //looking for existing username - if not found -> saves new to Mongo
      checkAvailability(users, user.username, function(err, msg) {
        if(msg === true) {
          console.log("Message: " + msg);
          getNextSequence(db, "userid", function(err, msg) {
            user.id = msg.seq;

            console.log("ID to be saved: " + user.id);
            users.insert(user, function(err, doc) {
              if(err) throw err;

              console.log("New user has been added to the DB: " + JSON.stringify(doc));
              callback(null, doc);
            });
          });
        } else {
          callback(null, "User already exist. Pick another username.");
        }
      });

    }, //updating user by ID
    updateUserByID: function(db, user, callback) {
      "use strict";
      var users = db.collection("users");
    }, //deleting user by ID
    deleteUserByID: function(db, user, callback) {
      "use strict";
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

function checkAvailability(db, user, callback) {

  db.findOne({username: user}, function (err, doc) {
    if(err) throw err;
    if(doc === null) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
}
