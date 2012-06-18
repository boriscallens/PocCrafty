Crafty.extend({
    /**@
    * #Crafty.isometric
    * @category 2D
    * Place entities in a 45deg isometric fashion.
    */
    isometric: {
        _iso: null,
        /**@
        * #Crafty.isometric.size
        * @comp Crafty.isometric
        * @sign public this Crafty.isometric.size(Number tileSize)
        * @param tileSize - The size of the tiles to place.
        * Method used to initialize the size of the isometric placement.
        * Recommended to use a size alues in the power of `2` (128, 64 or 32).
        * This makes it easy to calculate positions and implement zooming.
        * ~~~
        * var iso = Crafty.isometric.init(128);
        * ~~~
        * @see Crafty.isometric.place
        */
        init: function (tw, th, mw, mh, orientation) {

            switch (orientation) {
                case 'staggered': 
                    {

                        break;
                    }
                default: 
                    {
                        this._iso = Crafty.diamond.init(tw, th, mw, mh);
                    }
            }

            return this._iso;
        }
    }
});

/**@
* #Collision
* @category Collision
* Components to display Crafty.polygon Array for debugging collision detection
* * @example
* ~~~
* Crafty.e("2D,DOM,Player,Collision,WiredHitBox").collision(new Crafty.polygon([0,0],[0,300],[300,300],[300,0])) 
* ~~~
* this will display a wired square over your original Canvas screen 
*/
Crafty.c("WiredHitBox", {
    _points: {},
    _ctx: null,
    init: function () {

        if (!Crafty.support.canvas) return null;
        var c = document.getElementById('HitBox');
        if (!c) {
            c = document.createElement("canvas");
            c.id = 'HitBox';
            c.width = Crafty.viewport.width + 'px';
            c.height = Crafty.viewport.height + 'px';
            c.style.position = 'absolute';
            c.style.left = "0px";
            c.style.top = "0px";
            c.style.zIndex = Crafty.stage.elem.style.zIndex + 1;
            Crafty.stage.elem.appendChild(c);
        }

        this._ctx = c.getContext('2d');

        if (!this.map) this.collision();

        this.requires("Collision").bind("NewComponent", function () {
            this._points[this[0]] = [];
            this._points[this[0]].push(this.map.points);
        }).bind("RemoveComponent", function (id) {
            delete (this._points[id]);
        }).bind("Change", function () {
            this.drawHitBox();
        });


        return this;
    },
    drawHitBox: function () {
        // this._ctx.width = this._ctx.width;
        this._ctx.beginPath();
        for (var c in this._points) {
            var points = this._points[c];
            //  console.log(c);
            for (var p in points) {
                var point = points[p];
                if (p > 0) {

                    this._ctx.lineTo(point[0], point[1]);

                } else {
                    this._ctx.moveTo(point[0], point[1]);
                }

            }

        }
        this._ctx.closePath();
        this._ctx.stroke();
    }
});

Crafty.extend({
    diamondIso: {
        _tile: {
            w: 0,
            h: 0,
            r: 0
        },
        _map: {
            w: 0,
            h: 0
        },

        _origin: {
            x: 0,
            y: 0
        },

        init: function (tw, th, mw, mh) {
            this._tile.w = parseInt(tw);
            this._tile.h = parseInt(th) || parseInt(tw) / 2;
            this._tile.r = this._tile.w / this._tile.h;

            this._map.w = parseInt(mw);
            this._map.h = parseInt(mh) || parseInt(mw);

            this._origin.x = (this._map.h * this._tile.w / 2);
            this._origin.y = this._tile.h / 2;

            return this;
        },

        place: function (obj, x, y, offsetX, offsetY) {
            var pos = this.pos2px(x, y);
            if (!offsetX) offsetX = 0;
            if (!offsetY) offsetY = 0;

            obj.attr({
                x: (pos.left) + offsetX,
                y: (pos.top - obj.h) + offsetY,
                z: y
            });

        },
        centerAt: function (x, y) {
            var pos = this.pos2px(x, y);
            Crafty.viewport.x = -pos.left + Crafty.viewport.width / 2;
            Crafty.viewport.y = -pos.top + Crafty.viewport.height / 2;
        },
        pos2px: function (x, y) {
            var l = (x - y) * this._tile.w / 2 + this._origin.x;
            var t = (x + y) * this._tile.h / 2 + this._origin.y;

            return {
                left: l,
                top: t
            };
        },
        px2pos: function (left, top) {
            var x = left - this._origin.x;
            var y = top - this._origin.y;
            return {
                x: (y + (x / this._tile.r)) / this._tile.h,
                y: (y - (x / this._tile.r)) / this._tile.h
            };
        },
        Polygon: function () {

            var p = [
                [0, this._pos.y - this._t.h / 2],
                [this._t.w / 2, this._pos.y - 0],
                [this._t.w, this._pos.y - this._t.h / 2],
                [this._t.w / 2, this._pos.y - this._t.h]
            ];

            return new Crafty.Polygon(p);
        }

    }
});