var http = require('http');
var io = require('socket.io');
var pDb = require('./db/player');
var pokedex = require('./db/dex.json');
var movedex = require('./db/movedex.json');
var requestListener = function (request, response) {
  response.writeHead(200);
  response.end('Hello, World!\n');
};

var server = http.createServer(requestListener);
var uniqueRoomName = 0;
//sockets waiting for peers
var queue = []; //list of sockets waiting for peers
var rooms = {}; // map socket.id => room
var names = {}; // map socket.id => name
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

        		peer.emit('populate', {me: peerPrimaryId, you: socketPrimaryId});
        		socket.emit('populate', {me: socketPrimaryId, you: peerPrimaryId});
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
        // now check if sb is in queue
        findPairForSocket(socket);
    });

    socket.on('message', function (data) {
        var room = rooms[socket.id];
        socket.broadcast.to(room).emit('message', data);
    });




});



