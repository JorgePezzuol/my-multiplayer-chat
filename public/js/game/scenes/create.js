import createAnimations from "./animation.js";
import playerEventListener from "./player.js";
import mediaEventLister from "../../meeting.js";

export function _create(context) {
  const self = context;

  context.socket = io();

  self.isSpeaking = false;

  context.map = context.make.tilemap({ key: "map" });

  const tileset = context.map.addTilesetImage(
    "tuxmon-sample-32px-extruded",
    "tiles"
  );

  const belowLayer = context.map.createLayer("Below Player", tileset, 0, 0);

  const aboveLayer = context.map.createLayer("Above Player", tileset, 0, 0);
  context.worldLayer = context.map.createLayer("World", tileset, 0, 0);

  context.worldLayer.setCollisionByProperty({ collides: true });

  aboveLayer.setDepth(10);

  context.spawnPoint = context.map.findObject(
    "Objects",
    (obj) => obj.name === "Spawn Point"
  );

  context.camera = context.cameras.main;
  context.otherPlayers = context.physics.add.group();

  context.cursors = context.input.keyboard.createCursorKeys();

  context.keyA = context.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.A
  );
  context.keyS = context.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.S
  );
  context.keyD = context.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.D
  );
  context.keyW = context.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.W
  );

  // config animations and listen for player events
  createAnimations(context);
  playerEventListener(context, self);
  mediaEventLister(context, self);

  context.add
    .text(16, 16, "Procure pelos Gambuzinos\nWalk with 'WASD'", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff",
    })
    .setScrollFactor(0)
    .setDepth(30);


}
