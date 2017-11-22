var mongo = require('./mongo');

module.exports = {
	containsPlayer: function(player, callback) {
		console.log('Checking if db contains player: %s', player);
		mongo.Players.find({name: player}, function (err, user) {
			if (err) {
				//does not have
				callback(err);
			} else {
				callback(null, result.length > 0);
			}
		});
	},

	addPlayer: function (playerData, callback) {
		var p = new mongo.Players(playerData);
		p.save(function (error) {
			callback(error);
		})
	}
}