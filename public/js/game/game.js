import { _preload } from "./scenes/preload.js";
import { _create } from "./scenes/create.js";
import { _update } from "./scenes/update.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }
  preload() {
    _preload(this);
  }

  create() {
    _create(this);
  }

  update() {
    _update(this);
  }
}