$(function () {
    Crafty.init();
    var map = Crafty.e("tiled");

    map.loadMapFile("maps/test.tmx", function () {
        createSprites(map.sprites);
    });

    function createSprites(sprites) {
        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            //Crafty.sprite(sprite.imagePath, sprite.spriteWidth, sprite.spriteHeight, sprite.sprites, 0, 0, 0, 0);
            Crafty.sprite(64, 128, sprite.imagePath, sprite.sprites, 0, 0);
        }

        var tile = Crafty.e("2D", "DOM", "1");
        var iso = Crafty.diamondIso.init(64, 32, 3, 3);
        iso.place(tile, 2, 2, 0);
    };
});



String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
      ? args[number]
      : match;
    });
};