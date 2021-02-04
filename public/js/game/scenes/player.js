function _addPlayer(self) {
  self.player = self.physics.add
    .sprite(self.spawnPoint.x, self.spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
  self.physics.add.collider(self.player, self.worldLayer);
  self.player.username = _createFloatingUsername(self, true);
  self.camera.startFollow(self.player);
  self.camera.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
}

function _addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.physics.add
    .sprite(self.spawnPoint.x, self.spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.username = _createFloatingUsername(self, false);
  self.physics.add.collider(otherPlayer, self.worldLayer);
  self.otherPlayers.add(otherPlayer);
}

function _createFloatingUsername(self, isMyself) {
  return self.add.text(
    self.spawnPoint.x,
    self.spawnPoint.y,
    isMyself ? localStorage.getItem("username") : "",
    { font: "12px Arial Black", fill: "#000000" }
  );
}

export default function playerEventListener(context, self) {
  context.socket.on("currentPlayers", function (players) {
    Object.keys(players).forEach(function (id, index) {
      if (players[id].playerId === self.socket.id) {
        _addPlayer(self);
      } else {
        _addOtherPlayers(self, players[id]);
      }
    });
  });
  context.socket.on("newPlayer", function (playerInfo) {
    _addOtherPlayers(self, playerInfo);
  });
  context.socket.on("disconnect", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.username.destroy();
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
        otherPlayer.username.x = playerInfo.x - 30;
        otherPlayer.username.y = playerInfo.y - 30;
        otherPlayer.username.setText(playerInfo.username);
      }
    });
  });
  context.socket.on("playerIsSpeaking", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        const mouth = self.physics.add
          .sprite(otherPlayer.x - 30, otherPlayer.y - 50, "mouth")
          .setSize(45, 45);
        self.physics.add.collider(mouth, self.worldLayer);
        mouth.anims.play("mouth-speaking", true);

        setTimeout(() => {
          mouth.destroy();
        }, 1000);
      }
    });
  });
}
