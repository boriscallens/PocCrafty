Crafty.c("tiled", {
    path: "",
    directory: "",
    sprites: [],
    tiles: [],
    content: {},
    tilesetsLeftToParse: 0,
    layersLeftToParse: 0,
    loadMapFile: function (tmxPath, callback) {
        var map = this;

        $(Crafty).bind('onTmxLoaded', function (event, tmx) {
            console.log("onTmxLoaded", tmx);
            map.content = tmx;
            map.parseSprites();
            map.parseLayers();
        });
        $(Crafty).bind('onTsxLoaded', function (event, tsx, firstSpriteId) {
            var tiles = map.loadSpriteSet($(tsx).find('tileset'), firstSpriteId);
            map.sprites.push(tiles);
            map.tilesetsLeftToParse--;
            $(Crafty).trigger('onMapLoaded');
        });
        $(Crafty).bind('onMapLoaded', function () {
            // if all tilesets and layers are loaded
            if (map.tilesetsLeftToParse <= 0 && map.layersLeftToParse <= 0) {
                callback();
            }
        });

        $.ajax({
            type: "GET",
            url: tmxPath,
            dataType: "xml",
            success: function (xml) {
                $(Crafty).trigger('onTmxLoaded', xml);
            }
        });
        this.path = tmxPath;
        this.directory = tmxPath.substring(0, tmxPath.lastIndexOf('/') + 1);
    },
    parseSprites: function () {
        var map = this;
        var tilesets = $(map.content).find('tileset');
        map.tilesetsLeftToParse = tilesets.length;
        tilesets.each(function () {
            var tileset = $(this);
            var name = tileset.attr("name");

            if (!name) {
                var path = map.directory + $(tileset).attr("source");
                $.ajax({
                    type: "GET",
                    url: path,
                    dataType: "xml",
                    success: function (xml) {
                        var firstSpriteId = tileset.attr("firstgid");
                        $(Crafty).trigger('onTsxLoaded', [xml, firstSpriteId]);
                    }
                });
            } else {
                $(Crafty).trigger('onTsxLoaded', tileset);
            }

        });
        $(Crafty).trigger('onMapLoaded');
        return null;
    },
    parseLayers: function (aLayer) {
        var map = this;
        var layers = $(map.content).find('layer');
        map.layersLeftToParse = layers.length;
        layers.each(function () {
            var layer = $(this);
            var cols = layer.attr('width');
            var rows = layer.attr('height');
            var tileCounter = 0;
            var names = layer.find('data').text().replace(/[\r\n]+/gm, "").split(",");
            for (var col = 0; col < cols; col++) {
                for (var row = 0; row < rows; row++) {
                    console.log("col, row, name", col, row, names[tileCounter]);
                    var tile = {
                        x: col,
                        y: row,
                        name: names[tileCounter]
                    };
                    map.tiles.push(tile);
                    tileCounter++;
                }
            }
            map.layersLeftToParse--;
            $(Crafty).trigger('onMapLoaded');
        });

    },
    loadSpriteSet: function (aSpriteSet, firstSpriteId) {
        var map = this;
        if (map.shouldIgnoreSpriteSet(aSpriteSet)) return null;

        //var name = aSpriteSet.attr("name");
        var spriteWidth = aSpriteSet.attr('tilewidth');
        var spriteHeight = aSpriteSet.attr('tileheight');
        if (!firstSpriteId) firstSpriteId = aSpriteSet.attr('firstgid');
        var imagePath = map.directory + aSpriteSet.find('image').attr('source');
        var imageWidth = aSpriteSet.find('image').attr("width");
        var imageHeight = aSpriteSet.find('image').attr("height");
        return {
            imagePath: imagePath,
            spriteWidth: spriteWidth,
            spriteHeight: spriteHeight,
            sprites: map.getSprites(firstSpriteId, imageWidth, imageHeight, spriteWidth, spriteHeight)
        };
    },
    shouldIgnoreSpriteSet: function (aSpriteSet) {
        // If the property node "ignore" is present, a spriteset should not create sprites;
        return $(aSpriteSet).find('properties > property[name="ignore"]').length > 0;
    },
    getSprites: function (firstSpriteId, imageWidth, imageHeight, spriteWidth, spriteHeight) {
        var sprites = {};
        var numberOfColumns = (imageWidth / spriteWidth);
        var numberOfRows = imageHeight / spriteHeight;

        for (var col = 0; col < numberOfColumns; col++) {
            for (var row = 0; row < numberOfRows; row++) {
                sprites[firstSpriteId] = [col, row];
                firstSpriteId++;
            }
        }
        return sprites;
    }
});