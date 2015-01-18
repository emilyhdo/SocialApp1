
var db = require('./db');

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		var query = db.Users.where({username: username, password: password});

	     query.findOne(function (err, result) {
	         if (err) return handleError(err);
	         console.log(result);
	         if (result){    
				return done(null, {username: username});
	        }else{
	            return done(null, false);
	        }     
	    });
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, {username: username});
});

module.exports = passport;