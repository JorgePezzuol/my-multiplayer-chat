export default class Player {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

  init() {
    const context = this.gameScene;
    const self = this;
    this.gameScene.socket.on("currentPlayers", function (players) {
      Object.keys(players).forEach(function (id, index) {
        if (players[id].playerId === context.socket.id) {
          context.player = context.physics.add
            .sprite(
              context.spawnPoint.x,
              context.spawnPoint.y,
              "atlas",
              "misa-front"
            )
            .setSize(30, 40)
            .setOffset(0, 24);
          context.physics.add.collider(context.player, context.worldLayer);
          context.player.username = self._createFloatingUsername(true, context);
          context.camera.startFollow(context.player);
          context.camera.setBounds(
            0,
            0,
            context.map.widthInPixels,
            context.map.heightInPixels
          );
        } else {
          self._addOtherPlayer(players[id], context);
        }
      });
    });

    this.gameScene.socket.on("newPlayer", function (playerInfo) {
      self._addOtherPlayer(playerInfo, context);
    });
    this.gameScene.socket.on("disconnect", function (playerId) {
      context.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.username.destroy();
          otherPlayer.destroy();
        }
      });
    });
    this.gameScene.socket.on("playerMoved", function (playerInfo) {
      context.otherPlayers.getChildren().forEach(function (otherPlayer) {
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
    this.gameScene.socket.on("playerIsSpeaking", function (playerId) {
      context.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          const mouth = context.physics.add
            .sprite(otherPlayer.x - 30, otherPlayer.y - 30, "mouth")
            .setSize(45, 45);
          context.physics.add.collider(mouth, context.worldLayer);
          mouth.anims.play("mouth-speaking", true);

          setTimeout(() => {
            mouth.destroy();
          }, 1500);
        }
      });
    });
  }

  _addOtherPlayer(playerInfo, context) {
    const otherPlayer = context.physics.add
      .sprite(context.spawnPoint.x, context.spawnPoint.y, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);
    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.username = this._createFloatingUsername(false, context);
    context.physics.add.collider(otherPlayer, context.worldLayer);
    context.otherPlayers.add(otherPlayer);
  }

  _createFloatingUsername(isMyself, context) {
    return context.add.text(
      context.spawnPoint.x,
      context.spawnPoint.y,
      isMyself ? localStorage.getItem("username") : "",
      { font: "12px Arial Black", fill: "#000000" }
    );
  }
}
