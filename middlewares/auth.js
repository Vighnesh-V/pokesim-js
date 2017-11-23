var pDb = require('../db/player');


var checkExistingPlayer = function (req, res, next) {
	pDb.containsPlayer(req.query.key, function (err, results) {
		if (!err) {
			if (results) {
				console.log('Key ' + req.query.key + ' is present!');
				//res.render('battle');
				next(req, res, next);
			} else {
				console.log('Key ' + req.query.key + ' is not present!');
				pDb.addPlayer({name: req.query.key}, function (err) {
					if (err) {
						next(err);
					} else {
						console.log('error!');
					}
				});
				res.redirect('/');
			}
		}
	});
};


module.exports = checkExistingPlayer;