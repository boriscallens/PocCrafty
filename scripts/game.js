$(function () {
    var mapLoaded = false;
    var assetsLoaded = false;

    Crafty.init();
    Crafty.viewport.mouselook(true);
    Crafty.background("#000");
    $(Crafty).bind("Loaded", loaded);

    var map = Crafty.e("tiled");
    Crafty.load(["maps/grassland.png"], function () {
        assetsLoaded = true;
        $(Crafty).trigger("Loaded");
    });
    map.loadMapFile("maps/frontier_outpost.tmx", function () {
        mapLoaded = true;
        $(Crafty).trigger("Loaded");
    });

    function createSprites(sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            Crafty.sprite(sprite.spriteWidth * 1, sprite.spriteHeight * 1, sprite.imagePath, sprite.sprites, 0, 0, sprite.marginX * 1, sprite.marginY * 1);
        }
    }
    function createMap(tiles) {
        var tile;
        var iso = Crafty.diamondIso.init(64, 32, 64, 64);
        iso.centerAt(50, 20);
        for (var i = 0; i < tiles.length; i++) {
            tile = map.tiles[i];
            iso.place(Crafty.e("2D", "DOM", tile.name), tile.x, tile.y);
        }
    }
    function loaded() {
        if (mapLoaded && assetsLoaded) {
            createSprites(map.sprites);
            createMap(map.tiles);
        }
    }
});

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
      ? args[number]
      : match;
    });
};