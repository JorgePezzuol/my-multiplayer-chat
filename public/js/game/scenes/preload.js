export function _preload(context) {
  context.load.image(
    "tiles",
    "../assets/tilesets/tuxmon-sample-32px-extruded.png"
  );
  context.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");

  context.load.atlas(
    "atlas",
    "../assets/atlas/atlas.png",
    "../assets/atlas/atlas.json"
  );
}
