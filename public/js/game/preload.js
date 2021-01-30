export function preload() {
  this.load.image(
    "tiles",
    "../assets/tilesets/tuxmon-sample-32px-extruded.png"
  );
  this.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");

  this.load.atlas(
    "atlas",
    "../assets/atlas/atlas.png",
    "../assets/atlas/atlas.json"
  );
}
