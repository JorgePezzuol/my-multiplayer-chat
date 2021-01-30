

export function create() {
  var self = this;

  this.socket = io();

  this.map = this.make.tilemap({ key: "map" });

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = this.map.addTilesetImage(
    "tuxmon-sample-32px-extruded",
    "tiles"
  );

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = this.map.createStaticLayer("Below Player", tileset, 0, 0);
  const aboveLayer = this.map.createStaticLayer("Above Player", tileset, 0, 0);
  this.worldLayer = this.map.createStaticLayer("World", tileset, 0, 0);

  this.worldLayer.setCollisionByProperty({ collides: true });

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  this.spawnPoint = this.map.findObject(
    "Objects",
    (obj) => obj.name === "Spawn Point"
  );

  this.camera = this.cameras.main;
  this.otherPlayers = this.physics.add.group();
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

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

  this.add
    .text(16, 16, "Procure pelos Gambuzinos\nAnde usando 'WASD'", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff",
    })
    .setScrollFactor(0)
    .setDepth(30);

  this.socket.on("currentPlayers", function (players) {
    console.log(players);
    Object.keys(players).forEach(function (id, index) {
      //if (index == 0) return false;
      if (players[id].playerId === self.socket.id) {
        addPlayer(self);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  this.socket.on("newPlayer", function (playerInfo) {
    addOtherPlayers(self, playerInfo);
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
}

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