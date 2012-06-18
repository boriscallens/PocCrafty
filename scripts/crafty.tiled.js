Crafty.c("tiled", {
    path: "",
    directory: "",
    sprites: [],
    content: {},
    tilesetsLeftToParse: 0,
    loadMapFile: function (tmxPath, callback) {
        var map = this;

        $(Crafty).bind('onTmxLoaded', function (event, tmx) {
            console.log("onTmxLoaded", tmx);
            map.content = tmx;
            map.parseSprites();
        });
        $(Crafty).bind('onTsxLoaded', function (event, tsx, firstSpriteId) {
            var tiles = map.loadSpriteSet($(tsx).find('tileset'), firstSpriteId);
            map.sprites.push(tiles);
            map.tilesetsLeftToParse--;
            $(Crafty).trigger('onMapLoaded');
        });

        $(Crafty).bind('onMapLoaded', function () {
            if (map.tilesetsLeftToParse <= 0) {
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
    loadSpriteSet: function (aSpriteSet, firstSpriteId) {
        var map = this;
        if (map.shouldIgnoreSpriteSet(aSpriteSet)) return null;

        //var name = aSpriteSet.attr("name");
        var spriteWidth = aSpriteSet.attr('tilewidth');
        var spriteHeight = aSpriteSet.attr('tileheight');
        if(!firstSpriteId) firstSpriteId = aSpriteSet.attr('firstgid');
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
        //console.log("16", sprites.16);
        //        return {
        //            16: [0, 0],
        //            17: [1, 0],
        //            18: [2, 0],
        //            19: [3, 0],
        //            20: [4, 0],
        //            21: [5, 0],
        //            22: [6, 0],
        //            23: [7, 0],
        //            24: [8, 0],
        //            25: [9, 0],
        //            26: [10, 0],
        //            27: [11, 0],
        //            28: [12, 0],
        //            29: [13, 0]
        //        };
        return sprites;
    }
});