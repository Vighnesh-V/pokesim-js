var pDb = require('../db/player');

var isUserPresent = function (trainer, callback) {
	pDb.containsPlayer(trainer, callback);
};

var checkExistingPlayer = function (req, res, next) {
	isUserPresent (req.query.key, function (err, results) {
		if (err) {
			next (err);
		} else {
			if (results) {
				next(null, req, res);
			} else {
				//create a user here and go back to the main
				pDb.addPlayer({name: req.query.key, vals: "added-but-nonpresent"}, function (err) {
					next(err);
				});
				res.redirect('index');
			}
		}
	});
};

module.exports = checkExistingPlayer;