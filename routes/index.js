
module.exports = function () {

	var functions = {};


	functions.signup = function(req, res) {
		res.render('signup');
	};


	return functions;
};
