import Animation from "../Animation.js";
import MeetingJitsi from "../MeetingJitsi.js";
import PlayerMovement from "../PlayerMovement.js";
import Player from "../Player.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.otherPlayers = null;
    this.camera = null;
    this.spawnPoint = null;
    this.cursors = null;
    this.player = null;
    this.map = null;
    this.worldLayer = null;

    this.animsManager = new Animation(this);
    this.playerManager = new Player(this);
    this.playerMovementManager = new PlayerMovement(this);
    this.meetingJitsiManager = new MeetingJitsi(this);
  }

  preload() {
    this.load.image(
      "tiles",
      "../assets/tilesets/tuxmon-sample-32px-extruded.png"
    );
    this.load.spritesheet("mouth", "../assets/mouth-speaking3.png", {
      frameWidth: 45,
      frameHeight: 45,
    });
    this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");
    this.load.atlas(
      "atlas",
      "../assets/atlas/atlas.png",
      "../assets/atlas/atlas.json"
    );
  }

  create() {
    this.socket = io();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.camera = this.cameras.main;

    this.map = this.make.tilemap({ key: "map" });

    const tileset = this.map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "tiles"
    );

    const belowLayer = this.map.createLayer("Below Player", tileset, 0, 0);
    const aboveLayer = this.map.createLayer("Above Player", tileset, 0, 0);
    this.worldLayer = this.map.createLayer("World", tileset, 0, 0);
    this.worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);

    this.spawnPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );

    this.otherPlayers = this.physics.add.group();

    this.animsManager.init();
    this.playerManager.init();
    this.meetingJitsiManager.init();

    this.add
      .text(16, 16, "Search for the gambuzinos\nWalk with arrow keys", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0)
      .setDepth(30);
  }

  update() {
    this.playerMovementManager.init();
  }
}
