var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);

var players = {};

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("a user connected: ", socket.id);
  // create a new player and add it to our players object
  players[socket.id] = {
    x: 0,
    y: 0,
    playerId: socket.id,
    animation: "",
    username: "",
  };
  // send the players object to the new player
  socket.emit("currentPlayers", players);
  // update all other players of the new player
  socket.broadcast.emit("newPlayer", players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit("disconnect", socket.id);
  });

  // when a player moves, update the player data
  socket.on("playerMovement", function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].animation = movementData.animation;
    players[socket.id].username = movementData.username;
    // emit a message to all players about the player that moved
    socket.broadcast.emit("playerMoved", players[socket.id]);
  });

  // when a player speaks, emit to all other players a gif with a mouth speaking
  socket.on("playerHasSpoken", function (playerData) {
    socket.broadcast.emit("playerIsSpeaking", playerData.playerId);
  });
});

server.listen(process.env.PORT || 5000, function () {
  console.log(`Listening on ${server.address().port}`);
});
