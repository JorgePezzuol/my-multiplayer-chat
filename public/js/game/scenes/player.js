function addPlayer(self) {
  self.player = self.physics.add
    .sprite(self.spawnPoint.x, self.spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
  self.physics.add.collider(self.player, self.worldLayer);
  self.camera.startFollow(self.player);
  self.camera.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.physics.add
    .sprite(self.spawnPoint.x, self.spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
  otherPlayer.playerId = playerInfo.playerId;
  self.physics.add.collider(otherPlayer, self.worldLayer);
  self.otherPlayers.add(otherPlayer);
}

export default function _playerEventListener(context, self) {
  context.socket.on("currentPlayers", function (players) {
    Object.keys(players).forEach(function (id, index) {
      //if (index == 0) return false;
      if (players[id].playerId === self.socket.id) {
        addPlayer(self);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  context.socket.on("newPlayer", function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  context.socket.on("disconnect", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  context.socket.on("playerMoved", function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        if (playerInfo.animation === "") {
          otherPlayer.anims.stop();
        } else {
          otherPlayer.anims.play(playerInfo.animation, true);
        }
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });
}
