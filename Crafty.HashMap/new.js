function NewHashMap(cell){
	var _map = {};
	this.cellsize = cell || 64;
	this.minCol = 1;
	this.maxCol = 1;
	this.map = function () { return _map; };
};
NewHashMap.prototype.insert = function (obj) {
    var keys = this.key(obj);
    var entry = new Entry(keys, obj, this);
    this.minCol = Math.min(this.minCol, keys.x1);
    this.maxCol = Math.max(this.maxCol, keys.x2);
    var col, row;
    
    for (col = keys.x1; col <= keys.x2; col++) {
        var currentCol = this.map[col];
        if (!currentCol) this.map[col] = currentCol = { minRow: keys.y1, maxRow: keys.y2 };
        
        currentCol.minRow = Math.min(currentCol.minRow, keys.y1);
        currentCol.maxRow = Math.max(currentCol.maxRow, keys.y2);
        
        for (row = keys.y1; row <= keys.y2; row++) {
            var currentRow = this.map[col][row];
            if (!currentRow) this.map[col][row] = [];
            this.map[col][row].push(entry);
        }
    }
};
NewHashMap.prototype.remove = function (keys, obj) {
    var currentCol, currentRow, len, col, row, cell;
    if (arguments.length == 1) {
        obj = keys;
        keys = HashMap.key(obj);
    }
    for (col = keys.x1; col <= keys.x2; col++) {
        currentCol = this.map[col];
        if (!currentCol) continue;

        for (row = keys.y1; row <= keys.y2; row++) {
            currentRow = currentCol[row];
            if (!currentRow) continue;

            len = currentRow.length;
            for (cell = 0; cell < len; cell++) {
                if (currentRow[cell] && currentRow[cell][0] === obj[0]) {
                    currentRow.splice(cell, 1);
                }
            }
        }
    }
};
NewHashMap.prototype.search = function (rect, filter) {
    var results = [];
    var keys = this.key(rect);
    var startCol = Math.max(keys.x1, this.minCol);
    var endCol = Math.min(keys.x2, this.maxCol);
    var currentCol, currentRow, startRow, endRow, col, row;

    if (filter === undefined) {
        filter = true;
    }

    for (col = startCol; col <= endCol; col++) {
        currentCol = this.map[col];
        if (!col) continue;

        startRow = Math.max(keys.y1, currentCol.minRow);
        endRow = Math.min(keys.y2, currentCol.maxRow);
        for (row = startRow; row <= endRow; row++) {
            currentRow = currentCol[row];
            if (currentRow) {
                results = results.concat(currentRow);
            }
        }
    }
    if (filter) {
        var i, l, obj, id, finalresult = [], found = {};

        for (i = 0, l = results.length; i < l; i++) {
            obj = results[i];
            if (!obj) {
                continue;
            }
            id = obj[0];
            if (!found[id] && obj.x < rect._x + rect._w && obj._x + obj._w > rect._x && obj.y < rect._y + rect._h && obj._h + obj._y > rect._y) {
                found[id] = results[i];
            }
        }
        for (obj in found) {
            finalresult.push(found[obj]);
        }
        return finalresult;
    } else {
        return results;
    }
};
NewHashMap.prototype.boundaries = function () {
    var minX = 0, maxX = 0, minY = 0, maxY = 0;
    var entities, ent;
    // take all the entities on the upper extremes
    entities = this.map[this.map.maxCol][this.map.maxRow];
    for (ent in entities) {
        if (typeof ent == "object" && "requires" in ent) {
            maxX = Math.max(maxX, ent.x + ent.w);
            maxY = Math.max(maxY, ent.y + ent.h);
        }
    }
    // take all the entities on the upper extremes
    entities = this.map[this.map.minCol][this.map.minRow];
    for (ent in entities) {
        if (typeof ent == "object" && "requires" in ent) {
            minX = Math.min(minX, ent.x + ent.w);
            minY = Math.min(minY, ent.y + ent.h);
        }
    }
    return {
        max: {x: maxX, y: maxY},
        min: {x: minX, y: minY}
    };
};
NewHashMap.prototype.key = function (obj) {
    if (obj.hasOwnProperty("mbr")) {
        obj = obj.mbr();
    }
    return {
        x1: Math.floor(obj._x / this.cellsize),
        y1: Math.floor(obj._y / this.cellsize),
        x2: Math.floor((obj._w + obj._x) / this.cellsize),
        y2: Math.floor((obj._h + obj._y) / this.cellsize)
    };
};

function Entry(keys, obj, map) {
	this.keys = keys;
	this.map = map;
    this.obj = obj;
}
Entry.prototype = {
    update: function (rect) {
        this.map.remove(this.keys, this.obj);
        var e = this.map.insert(this.obj);
        this.keys = e.keys;
    }
};