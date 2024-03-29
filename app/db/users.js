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

    }, //get friend list
    getFriends: function(db, user, callback) {
      "use strict";
      var users = db.collection("users");
      console.log(user);
      users.find({'friends':{$in:[user]}},{"_id":0,"__v":0,"friends":0,"facebook":0}).toArray(function(err, doc) {
        if(err) console.log("Erro getting friends inside app/db");
        console.log("friends: " + JSON.stringify(doc));
        callback(null, doc);
      })
    }, //add friend
    addFriend: function(db, username, friend, callback) {
      "use strict";
      var users = db.collection("users");
      console.log(username);
      users.update({"username":username},{"$addToSet":{"friends":friend}}, function(err, doc) {
        if(err) console.log("Error getting friends inside app/db");
        console.log("friends: " + JSON.stringify(doc));
        callback(null, doc);
      })
    },
    notifyFriend: function(db, userRequests, userToNotify, callback) {
      "use strict";
      var users = db.collection("users");

      users.update({"username": userToNotify},{"$addToSet":{"friendRequest":userRequests}}, function(err, doc) {
        if(err) console.log("Error setting notification");
        console.log("Success")
        callback(null, doc);
      })
    },
    friendConfirm: function(db, username, friendToConfirm, flag, callback) {
      "use strict";
      var users = db.collection("users");
      if(flag == 'yes') {
        users.update({"username":username},{"$addToSet":{"friends":friendToConfirm}}, function(err, doc) {
          if(err) console.log("Error getting friends inside app/db");
          users.update({"username":username},{"$pull":{"friendRequest":friendToConfirm}}, function(err, msg) {
            if(err) console.log("Error getting friends inside app/db");
            console.log("friends NO: " + JSON.stringify(msg));
            callback(null, doc);
          });
        });
      } else if(flag == 'no') {
        users.update({"username":username},{"$pull":{"friendRequest":friendToConfirm}}, function(err, doc) {
          if(err) console.log("Error getting friends inside app/db");
          console.log("friends NO: " + JSON.stringify(doc));
          callback(null, doc);
        });
      }
    },
    removeFriend: function(db, username, friend, callback) {
      "use strict";
      var users = db.collection("users");
      console.log(username);
      users.update({"username":username},{"$pull":{"friends":friend}}, function(err, doc) {
        if(err) console.log("Error getting friend in me inside app/db");
        users.update({"username":friend},{"$pull":{"friends":username}}, function(err, msg) {
          if(err) console.log("Error removing me in friend inside app/db");
          console.log("friends: " + JSON.stringify(msg));
          callback(null, doc);
        })
      })
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
