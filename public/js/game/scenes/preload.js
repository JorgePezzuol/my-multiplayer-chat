export function _preload(context) {
  context.load.image(
    "tiles",
    "../assets/tilesets/tuxmon-sample-32px-extruded.png"
  );

  context.load.spritesheet("mouth", "../assets/mouth-speaking2.png", {
    frameWidth: 45,
    frameHeight: 45,
  });

  context.load.tilemapTiledJSON("map", "../assets/tilemaps/tuxemon-town.json");

  context.load.atlas(
    "atlas",
    "../assets/atlas/atlas.png",
    "../assets/atlas/atlas.json"
  );
}
