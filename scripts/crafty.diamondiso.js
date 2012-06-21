Crafty.extend({
    diamondIso: {
        _tile: {
            w: 0,
            h: 0,
            offset: {
                x: 0,
                y: 0
            }
        },
        _map: {
            w: 0,
            h: 0
        },
        _origin: {
            x: 0,
            y: 0
        },
        _pos: {
            x: 0,
            y: 0
        },

        init: function (tw, th, mw, mh) {
            this._tile.w = parseInt(tw);
            this._tile.h = parseInt(th) || parseInt(tw / 2);
            this._map.w = parseInt(mw);
            this._map.h = parseInt(mh) || parseInt(mw);

            var isoWidth = mh * (tw / 2) + mh * (tw / 2);
            //var isoHeight = mh * (th / 2) + mh * (th / 2);

            this._origin.x = isoWidth / 2 - tw;
            this._origin.y = 0;

            return this;
        },

        place: function (obj, x, y) {
            this._tile.offset.x = obj.w / 2;
            this._tile.offset.y = obj.h;

            var pos = this.pos2px(x, y);

            obj.attr({
                x: pos.left - this._tile.offset.x,
                y: pos.top - this._tile.offset.y,
                z: y
            });


        },

        pos2px: function (x, y) {
            var l = (x * this._tile.w / 2 + this._tile.offset.x) - (y * this._tile.w / 2);
            var t = (x * this._tile.h / 2 + this._tile.offset.y) + (y * this._tile.h / 2);

            return {
                top: ~ ~(t + this._origin.y),
                left: ~ ~(l + this._origin.x)
            };
        },
        polygon: function () {

            var p = [
                [this._pos.x - 0, this._pos.y - this._tile.h / 2],
                [this._pos.x - this._tile.w / 2, this._pos.y - 0],
                [this._pos.x - this._tile.w, this._pos.y - this._tile.h / 2],
                [this._pos.x - this._tile.w / 2, this._pos.y - this._tile.h]
            ];
            p = new Crafty.polygon(p);
            // p.shift(this._pos.x,this._pos.y);
            return p;
        }

    }
});