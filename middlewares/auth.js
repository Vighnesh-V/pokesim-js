var pDb = require('../db/player');
var mongo = require('../db/mongo');
var Pokemon = require('../db/Pokemon');
var checkExistingPlayer = function (req, res, next) {
	console.log('here');
	pDb.containsPlayer(req.query.key, function (err, results) {
		if (!err) {
			if (results) {
				console.log('Key ' + req.query.key + ' is present!');
				//res.render('battle');
				next(req, res, next);
			} else {
				//we have to generate two random pokemon.
				var dex1 = Math.floor(Math.random()*(151)+1);
				var dex2 = Math.floor(Math.random()*(151)+1);
				var pk1 = new Pokemon(req.query.key, dex1);
				var pk2 = new Pokemon(req.query.key, dex2);


				var t1 = new mongo.Pokemon({
					id: pk1.id,
					level: pk1.level,
					trainer: pk1.trainer,
				});


				var t2 = new mongo.Pokemon({
					id: pk2.id,
					level: pk2.level,
					trainer: pk2.trainer
				});

				for (var i = 0; i < 4; i++) {
					if (pk1.moveset[i] === undefined) {
						t1.moveset.push('Tackle');
					} else {
						t1.moveset.push(pk1.moveset[i].move);
					}

					if (pk2.moveset[i] === undefined) {
						t2.moveset.push('Tackle');
					} else {
						t2.moveset.push(pk2.moveset[i].move);
					}
					
				}

				console.log('Key ' + req.query.key + ' is not present!');
				pDb.addPlayer({name: req.query.key, prim: t1, seco: t2, battles: 0}, function (err) {
					if (err) {
						next(err);
					} else {
					}
				});
				res.redirect('/');
			}
		}
	});
};


module.exports = checkExistingPlayer;