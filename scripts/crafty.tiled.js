Crafty.c("tiled", {
    path: "",
    directory: "",
    sprites: [],
    tiles: [],
    content: {},
    tilesetsLeftToParse: 9999,
    layersLeftToParse: 9999,

    loadMapFile: function (tmxPath, callback) {
        var map = this;

        $(Crafty).bind('onTmxLoaded', function (event, tmx) {
            map.content = tmx;
            map.parseSprites();
            map.parseLayers();
        });
        $(Crafty).bind('onTsxLoaded', function (event, tsx, firstSpriteId) {
            //find the tileset in root or childnode
            var tiles = map.loadSpriteSet($(tsx).filter('tileset').add($(tsx).find('tileset')), firstSpriteId);
            if (tiles != null) map.sprites.push(tiles);
            map.tilesetsLeftToParse--;
            $(Crafty).trigger('onMapLoaded');
        });
        $(Crafty).bind('onMapLoaded', function () {
            // if all tilesets and layers are loaded
            if (map.tilesetsLeftToParse <= 0 && map.layersLeftToParse <= 0) {
                //map.filterSprites();
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
    parseLayers: function () {
        var map = this;
        var layers = $(map.content).find('layer');
        map.layersLeftToParse = layers.length;
        layers.each(function () {
            var layer = $(this);
            var cols = layer.attr('width');
            var rows = layer.attr('height');
            var tileCounter = 0;
            var names = layer.find('data').text().replace(/[\r\n]+/gm, "").split(",");
            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    if (names[tileCounter] != '0') {
                        var tile = {
                            x: col,
                            y: row,
                            name: names[tileCounter]
                        };
                        map.tiles.push(tile);
                    }
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
        var imageFilename = aSpriteSet.find('image').attr('source'); ;
        // external tileset
        if (!firstSpriteId) {
            firstSpriteId = aSpriteSet.attr('firstgid');
            imageFilename = imageFilename.substring(imageFilename.lastIndexOf('/') + 1);
        }
        var offset = aSpriteSet.find('tileoffset');
        var offsetX = offset.attr('x') || 0;
        var offsetY = offset.attr('y') || 0;

        var imagePath = map.directory + imageFilename;
        var imageWidth = aSpriteSet.find('image').attr("width");
        var imageHeight = aSpriteSet.find('image').attr("height");
        var sprites = map.getSprites(firstSpriteId, imageWidth, imageHeight, spriteWidth, spriteHeight);

        return {
            imagePath: imagePath,
            spriteWidth: spriteWidth,
            spriteHeight: spriteHeight,
            marginX: offsetX,
            marginY: offsetY,
            sprites: sprites
        };
    },
    shouldIgnoreSpriteSet: function (aSpriteSet) {
        // If the property node "ignore" is present, a spriteset should not create sprites;
        return $(aSpriteSet).find('properties > property[name="ignore"]').length > 0;
    },
    getSprites: function (firstSpriteId, imageWidth, imageHeight, spriteWidth, spriteHeight) {
        var sprites = {};
        var numberOfColumns = imageWidth / spriteWidth;
        var numberOfRows = imageHeight / spriteHeight;

        for (var row = 0; row < numberOfRows; row++) {
            for (var col = 0; col < numberOfColumns; col++) {
                sprites[firstSpriteId] = [col, row];
                firstSpriteId++;
            }
        }
        return sprites;
    },
    filterSprites: function () {
        var map = this;
        var usedSpriteNames = [];
        for (var tileCounter = 0; tileCounter < map.tiles.length; tileCounter++) {
            usedSpriteNames.push(map.tiles[tileCounter].name);
        }

        for (var i = 0; i < map.sprites.length; i++) {
            var _sprites = map.sprites[i].sprites;
            for (var spriteName in _sprites) {
                if (usedSpriteNames.indexOf(spriteName) == -1) {
                    delete map.sprites[i].sprites[spriteName];
                }
            }
        }
    }
});