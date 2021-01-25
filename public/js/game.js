const config = {
  type: Phaser.AUTO,
  width: 1050,
  height: 850,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px-extruded.png");
  this.load.tilemapTiledJSON("map", "assets/tilemaps/tuxemon-town.json");
  this.load.atlas("atlas", "assets/atlas/atlas.png", "assets/atlas/atlas.json");
}

function create() {

  const map = this.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  const spawnPoint = map.findObject(
    "Objects",
    (obj) => obj.name === "Spawn Point"
  );

  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();

  this.socket.on("currentPlayers", function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        //addVideo();
        addPlayer(self, players[id], worldLayer);
      } else {
        console.log("a");
        //addVideo();
        addOtherPlayers(self, players[id], worldLayer);
      }
    });
  });
  this.socket.on("newPlayer", function (playerInfo) {
    addOtherPlayers(self, playerInfo);
    console.log("c");
  });
  this.socket.on("disconnect", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on("playerMoved", function (playerInfo) {
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
  this.cursors = this.input.keyboard.createCursorKeys();
}

function addPlayer(self, playerInfo, worldLayer) {
  self.player = self.physics.add
    .sprite(playerInfo.x, playerInfo.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
  self.physics.add.collider(self.player, worldLayer);
}

function addOtherPlayers(self, playerInfo, worldLayer) {
  const otherPlayer = self.physics.add
    .sprite(playerInfo.x, playerInfo.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);
  otherPlayer.playerId = playerInfo.playerId;
  self.physics.add.collider(otherPlayer, worldLayer);
  self.otherPlayers.add(otherPlayer);
}

function update() {
  if (this.player) {
    const speed = 175;
    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    this.physics.world.wrap(this.player, 5);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    if (this.cursors.left.isDown) {
      this.player.anims.play("misa-left-walk", true);
      this.socket.emit("playerMovement", {
        x: this.player.x,
        y: this.player.y,
        animation: "misa-left-walk",
      });
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("misa-right-walk", true);
      this.socket.emit("playerMovement", {
        x: this.player.x,
        y: this.player.y,
        animation: "misa-right-walk",
      });
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("misa-back-walk", true);
      this.socket.emit("playerMovement", {
        x: this.player.x,
        y: this.player.y,
        animation: "misa-back-walk",
      });
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("misa-front-walk", true);
      this.socket.emit("playerMovement", {
        x: this.player.x,
        y: this.player.y,
        animation: "misa-front-walk",
      });
    } else {
      this.player.anims.stop();
      this.socket.emit("playerMovement", {
        x: this.player.x,
        y: this.player.y,
        animation: "",
      });
    }
  }
}

function addVideoStream(video, stream) {
  const videoGrid = document.getElementById("video-grid");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
