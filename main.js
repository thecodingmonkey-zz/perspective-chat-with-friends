var http = require('http'),
	fs = require('fs'),
	sanitize = require('validator').sanitize;
	
var app = http.createServer(function (request, response) {
	fs.readFile("client.html", 'utf-8', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(process.env.PORT || 5000);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) { 
	socket.on('message_to_server', function(data) { 
		var escaped_message = sanitize(data["message"]).escape();
		var escaped_nick = sanitize(data["nick"]).escape();
		var escaped_alterable = sanitize(data["alterable"]).escape();
		var escaped_query = sanitize(data["query"]).escape();

		io.sockets.emit("message_to_client",{ nick: escaped_nick, message: escaped_message,
			alterable: escaped_alterable, query: escaped_query }); 
	});
});
