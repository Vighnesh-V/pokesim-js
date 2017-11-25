var mongo = require('./mongo');

module.exports = {
	containsPlayer: function(player, callback) {
		mongo.Trainer.find({name: player}, function (err, user) {

			if (err) {
				callback(err);
			} else {

				callback(null, user.length > 0);
			}
		});
	},

	addPlayer: function (playerData, callback) {
		var p = new mongo.Trainer(playerData);
		p.save(function (error) {
			callback(error);
		})
	},

	getPlayer: function (player, callback) {
		mongo.Trainer.find({name: player}, function (err, user) {
			if (err) {
				callback (err);
			} else {
				callback(null, user);
			}
		});
	}
}