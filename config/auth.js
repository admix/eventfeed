var habitat = require("habitat");
habitat.load();
var env = new habitat();
module.exports = {
	'facebookAuth' : {
		'clientID' 	:  env.get("FB_ID"),
		'clientSecret' 	: env.get("FB_SECRET"),
		'callbackURL' 	: env.get("FB_CALLBACK")
	},

	'twitterAuth' : {
		'consumerKey' 	: env.get("TW_ID"),
		'consumerSecret': env.get("TW_SECRET"),
		'callbackURL' 	: env.get("TW_CALLBACK")
	}
	
	'googleAuth' : {
		'clientID' 	: '57060957916-57uijbmjopch07m6kp7akad5kuhnnhmi.apps.googleusercontent.com',
		'clientSecret' 	: 'N6oOioVixigHiqS_FqH9Br1f ',
		'callbackURL' 	: 'http://127.0.0.1:8080/auth/google/callback'
	}
	
};
