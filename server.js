var http = require('http');
var io = require('socket.io');
var pDb = require('./db/player');
var dex = require('./db/dex.json').data;
var movedex = require('./db/movedex.json');
var requestListener = function (request, response) {
  response.writeHead(200);
  response.end('Hello, World!\n');

};


var HP = function (Base, Level) {
    return Math.floor((2 * Base + 94) * Level / 100 ) + Level + 10;
};

var OtherStats = function  (Base, Level) {
    return HP(Base, Level) - Level - 5;
};


var server = http.createServer(requestListener);
var uniqueRoomName = 0;
//sockets waiting for peers
var queue = []; //list of sockets waiting for peers
var rooms = {}; // map socket.id => room
var names = {}; // map socket.id => name
var rev = {};
var allUsers = {}; //map socket.id => socket

var findPairForSocket = function(socket) {
	if (queue.length > 0) {
		var peer = queue.pop();
		var room = socket.id + '#' + peer.id;

		peer.join(room);
        socket.join(room);
        // register rooms to their names
        rooms[peer.id] = room;
        rooms[socket.id] = room;
        // exchange names between the two of them and start the chat
        var peerName = names[peer.id];
        var socketName = names[socket.id];
        console.log(peerName);
        pDb.getPlayer(peerName, function (e1, peerData) {
        	pDb.getPlayer(socketName, function (e2, socketData){
        		var peerPrimaryId = peerData[0].prim.id;
        		var socketPrimaryId = socketData[0].prim.id;
                var peerMoves = peerData[0].prim.moveset;
                var socketMoves = socketData[0].prim.moveset;
                var peerpoke = dex[peerPrimaryId - 1].name;
                var socketpoke = dex[socketPrimaryId - 1].name;
        		peer.emit('populate', {me: peerPrimaryId, you: socketPrimaryId, mem: peerMoves, men: peerpoke, youn: socketpoke});
        		socket.emit('populate', {me: socketPrimaryId, you: peerPrimaryId, mem: socketMoves, men: socketpoke, youn: peerpoke});
        	});
        });

	} else {
		queue.push(socket);
	}
}


server.listen(8080, function () {
  console.log('Server is running...');
});

var socketServer = io(server);

socketServer.on('connection', function (socket) {
	console.log('User '+socket.id + ' connected');
	socket.on('login', function (data) {
        names[socket.id] = data.name;
        allUsers[socket.id] = socket;
        rev[data.name] = socket.id;
        // now check if sb is in queue
        findPairForSocket(socket);
    });

    socket.on('message', function (data) {
        var room = rooms[socket.id];
        var socketid = socket.broadcast.to(room).emit('message', data);
    });

    socket.on('get_player_secondary', function (data) {
        console.log('here');
        pDb.getPlayer(data.name, function (err, result) {
            if (data.p > 1) {
                //player deaths have exceeded 2
                //give no one experience - last pokemon died.
                var n = result[0].name;
                var primary = result[0].prim;
                var secondary = result[0].seco;
                var battles = result[0].battles;
                if (battles + 1 === 5) {
                    //level up:
                    primary.level = primary.level + 1;
                    secondary.level = secondary.level + 1;

                    var pmovelist = dex[primary.id - 1].learnable;
                    var smovelist = dex[secondary.id - 1].learnable;
                    var pmove;
                    var smove;
                    pmovelist = pmovelist.filter(function (move) {
                        if (move.level == primary.level) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    smovelist = smovelist.filter(function (move) {
                        if (move.level === secondary.level) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (pmovelist.length != 0) {
                        pmove = pmovelist[0].move;
                    }

                    if (smovelist.length != 0) {
                        smove = smovelist[0].move;
                    }

                    pmovelist = primary.moveset;
                    smovelist = secondary.moveset;

                    pmovelist[3] = pmove;
                    smovelist[3] = smove;

                    primary.moveset = pmovelist;
                    secondary.moveset = smovelist;

                    //calculate evolutions

                    var pevolist = dex[primary.id - 1].evos;
                    var sevolist = dex[secondary.id - 1].evos;

                    pevolist = pevolist.filter(function(evo) {
                        if (evo.level === primary.level) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    sevolist = sevolist.filter(function (evo) {
                        if (evo.level === primary.level) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (pevolist.length > 0) {
                        primary.id = pevolist[0].id;
                    }

                    if (sevolist.length > 0) {
                        secondary.id = sevolist[0].id;
                    }

                    battles = 0;
                } else {
                    battles += 1;
                }

                var playerData = {
                    name: n,
                    prim: primary,
                    seco: secondary,
                    battles: battles
                };
                pDb.updatePlayer(playerData, function (err) {
                    console.log('update player side');
                    
                });

                socket.emit('game_over');
            } else {
                var id = result[0].seco.id;
                var poke = dex[id - 1].name;
                var moveset = result[0].seco.moveset;
                socket.emit('repopulate_player', {
                    id: id,
                    name: poke,
                    moveset: moveset
                });
            }
            
        });
    });

    socket.on('get_enemy_secondary', function (data) {
      if (data.e > 1) {
        pDb.getPlayer(data.me, function (err, result) {
            var n = result[0].name;
            var primary = result[0].prim;
            var secondary = result[0].seco;
            var battles = result[0].battles;
            if (battles + 1 === 5) {
                //level up:
                primary.level = primary.level + 1;
                secondary.level = secondary.level + 1;

                var pmovelist = dex[primary.id - 1].learnable;
                var smovelist = dex[secondary.id - 1].learnable;
                var pmove;
                var smove;
                pmovelist = pmovelist.filter(function (move) {
                    if (move.level == primary.level) {
                        return true;
                    } else {
                        return false;
                    }
                });

                smovelist = smovelist.filter(function (move) {
                    if (move.level === secondary.level) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if (pmovelist.length != 0) {
                    pmove = pmovelist[0].move;
                }

                if (smovelist.length != 0) {
                    smove = smovelist[0].move;
                }

                pmovelist = primary.moveset;
                smovelist = secondary.moveset;

                pmovelist[3] = pmove;
                smovelist[3] = smove;

                primary.moveset = pmovelist;
                secondary.moveset = smovelist;

                //calculate evolutions

                var pevolist = dex[primary.id - 1].evos;
                var sevolist = dex[secondary.id - 1].evos;

                pevolist = pevolist.filter(function(evo) {
                    if (evo.level === primary.level) {
                        return true;
                    } else {
                        return false;
                    }
                });

                sevolist = sevolist.filter(function (evo) {
                    if (evo.level === primary.level) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if (pevolist.length > 0) {
                    primary.id = pevolist[0].id;
                }

                if (sevolist.length > 0) {
                    secondary.id = sevolist[0].id;
                }

                battles = 0;
            } else {
                battles += 1;
            }

            var playerData = {
                name: n,
                prim: primary,
                seco: secondary,
                battles: battles
            };
            pDb.updatePlayer(playerData, function (err) {
                console.log('updated enemy side');
            });

            socket.emit('game_over');
        });
      } else {
        pDb.getPlayer(data.name, function (err, result){
            var id = result[0].seco.id;
            var poke = dex[id - 1].name;
            console.log(data.name);
            socket.emit('repopulate_enemy', {id: id, name: poke});
        }); 
      }
      
    });

    socket.on('move', function(data) {

        if (data.numMovesMade == 2) {
            var player1Name = data.sender;
            var player1PokeId = data.mypoke;
            var player1PokeHealth = data.otherMove.hishealth;
            var player1Socketid = rev[player1Name];
            var player1Move = data.move;
            var player1MoveType = movedex[player1Move]["type"];
            var player1MovePower = movedex[player1Move]["pow"];
            var socket1 = allUsers[player1Socketid];


            var player2Name = data.otherMove.sender;
            var player2PokeId = data.yourpoke;
            var player2PokeHealth = data.hishealth;
            var player2Socketid = rev[player2Name];
            var player2Move = data.otherMove.move;
            var player2MoveType = movedex[player2Move]["type"];
            var player2MovePower = movedex[player2Move]["pow"];
            var socket2 = allUsers[player2Socketid];

            var P1BATK = dex[player1PokeId - 1]["bstats"][1];
            var P1BSPD = dex[player1PokeId - 1]["bstats"][4];
            var P2BDEF = dex[player2PokeId - 1]["bstats"][2];
            var P2BHP = dex[player2PokeId - 1]["bstats"][0];

            var P2BATK = dex[player2PokeId - 1]["bstats"][1];
            var P2BSPD = dex[player2PokeId - 1]["bstats"][4];
            var P1BDEF = dex[player1PokeId - 1]["bstats"][2];
            var P1BHP = dex[player1PokeId - 1]["bstats"][0];

            var P1STAB;
            var P2STAB;

            if (dex[player2PokeId - 1]["types"].indexOf(movedex[player2Move]["type"]) > -1) {
                P2STAB = 1.5;
            } else {
                P2STAB = 1;
            }

            if (dex[player1PokeId - 1]["types"].indexOf(movedex[player1Move]["type"]) > -1) {
                P1STAB = 1.5;
            } else {
                P1STAB = 1;
            }

            pDb.getPlayer(player1Name, function (err, res1) {
                pDb.getPlayer(player2Name, function (err, res2) {
                    var P1level;
                    if (res1[0].prim.id === player1PokeId) {
                        P1level = res1[0].prim.level;
                    }  else {
                        P1level = res1[0].seco.level;
                    }
                    var P2level;
                    if (res2[0].prim.id === player2PokeId) {
                        P2level = res2[0].prim.level;
                    }  else {
                        P2level = res2[0].seco.level;
                    }

                    var P1ATK = OtherStats(P1BATK, P1level);
                    var P2DEF = OtherStats(P2BDEF, P2level);
                    var P2HP = HP(P2BHP, P2level); 

                    var P2ATK = OtherStats(P2BATK, P2level);
                    var P1DEF = OtherStats(P1BDEF, P1level);
                    var P1HP = HP(P1BHP, P1level); 
                    var r = (Math.random() * (0.15) + 0.85);
                    socket1.emit('update-health', {
                        them: {
                            level: P1level,
                            power: player1MovePower,
                            atk: P1ATK,
                            def: P2DEF,
                            hp: P2HP,
                            stab: P1STAB,
                            attackingtype: player1MoveType,
                            deftype:  dex[player2PokeId - 1]["types"],
                            spd : P2BSPD,
                            name: player2Name
                        },

                        me: {
                            level: P2level,
                            power: player2MovePower,
                            atk: P2ATK,
                            def: P1DEF,
                            hp: P1HP,
                            stab: P2STAB,
                            attackingtype: player2MoveType,
                            deftype:  dex[player1PokeId - 1]["types"],
                            spd: P1BSPD,
                            name: player1Name
                        },

                        random: r
                    });

                    socket2.emit('update-health', {
                        me: {
                            level: P1level,
                            power: player1MovePower,
                            atk: P1ATK,
                            def: P2DEF,
                            hp: P2HP,
                            stab: P1STAB,
                            attackingtype: player1MoveType,
                            deftype:  dex[player2PokeId - 1]["types"],
                            spd: P2BSPD,
                            name: player2Name
                        },

                        them: {
                            level: P2level,
                            power: player2MovePower,
                            atk: P2ATK,
                            def: P1DEF,
                            hp: P1HP,
                            stab: P2STAB,
                            attackingtype: player2MoveType,
                            deftype:  dex[player1PokeId - 1]["types"],
                            spd: P1BSPD,
                            name: player1Name
                        },

                        random: r
                    });

                
                });
                

            });


        } else if (data.numMovesMade == 1) {
            var room = rooms[socket.id];
            socket.broadcast.to(room).emit('increment', data);
        }
    });






});



