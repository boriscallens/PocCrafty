$(function () {
    Crafty.init();
    var map = Crafty.e("tiled");

    map.loadMapFile("maps/test.tmx", function () {
        createSprites(map.sprites);
        createMap(map.tiles);
    });

    function createSprites(sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            //Crafty.sprite(sprite.imagePath, sprite.spriteWidth, sprite.spriteHeight, sprite.sprites, 0, 0, 0, 0);
            Crafty.sprite(64, 64, sprite.imagePath, sprite.sprites, 0, 0);
        }
    };
    function createMap(tiles) {
        var tile;
        var iso = Crafty.diamondIso.init(64, 32, 3, 3);
        for (var i = 0; i < tiles.length; i++) {
            tile = map.tiles[i];
            iso.place(Crafty.e("2D", "DOM", tile.name), tile.x, tile.y);
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