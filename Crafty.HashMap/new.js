function NewHashMap(cell){
	this.map = {};
	this.cellsize = cell || 64;
	this.minCol = Infinity;
	this.maxCol = - Infinity;
	this.minX = Infinity;
	this.maxX = - Infinity;
	this.minY = Infinity;
	this.maxY = - Infinity
	this.entries = [];
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

NewHashMap.prototype.insert = function (obj) {
	var keys = this.key(obj);
	var entry = new Entry(keys, obj, this);
	this.minCol = Math.min(this.minCol, keys.x1);
	this.maxCol = Math.max(this.maxCol, keys.x2);
	this.minX = Math.min(this.minX, obj._x);
	this.minY = Math.min(this.minY, obj._y);
	this.maxX = Math.max(this.maxX, obj._x + obj._w);
	this.maxY = Math.max(this.maxY, obj._y + obj._h);
	
	this.entries.push(entry);
	
	//TODO: fase all this shit out
	var col, row;	
	for (col = keys.x1; col <= keys.x2; col++) {
		var currentCol = this.map[col];
		if (!currentCol) this.map[col] = currentCol = { minRow: keys.y1, maxRow: keys.y2 };
		
		currentCol.minRow = Math.min(currentCol.minRow, keys.y1);
		currentCol.maxRow = Math.max(currentCol.maxRow, keys.y2);
		
		for (row = keys.y1; row <= keys.y2; row++) {
			var currentRow =currentCol[row];
			if (!currentRow) currentCol[row] = [];
			this.map[col][row].push(entry);
		}
	}	
};

NewHashMap.prototype.isContainedBy = function(entry, keys){
	return (
		entry.keys.x1 >= keys.x1 &&
		entry.keys.x2 <= keys.x2 &&
		entry.keys.y1 >= keys.y1 &&
		entry.keys.y2 <= keys.y2
	);
};

NewHashMap.prototype.remove = function (keys, obj) {
	// optional argument handling
	if (arguments.length == 1){
		obj = keys;
		keys = this.key(obj);
	}
	
	var me = this;
	me.entries = me.entries.filter(function(entry){
		return me.isContainedBy(entry, keys) && entry.obj !== obj;
	});
	var allX = [];
	var allY = [];
	for (var i = 0; i <= me.entries.length-1; i++){
		allX.push(me.entries[i].keys.x1);
		allX.push(me.entries[i].keys.x2);
		allY.push(me.entries[i].keys.y1);
		allY.push(me.entries[i].keys.y2);
	}
	this.minX = Math.min.apply(Math, allX);
	this.maxX = Math.max.apply(Math, allX);
	this.minY = Math.min.apply(Math, allY);
	this.maxY = Math.max.apply(Math, allY);
	
	//TODO: fase all this shit out
	var currentCol, currentRow, len, col, row, cell;
	var myMap = this.map
	
	for (col = keys.x1; col <= keys.x2; col++) {
		currentCol = myMap[col];
		if (!currentCol) continue;

		for (row = keys.y1; row <= keys.y2; row++) {
			currentRow = currentCol[row];
			if (!currentRow) continue;

			len = currentRow.length;
			for (cell = len-1; cell >= 0; cell--) {
				if (currentRow[cell] && currentRow[cell][0] === obj[0]) {
					currentRow.splice(cell, 1);
				}
			}			
		}
		//recalculate minrow and maxrow
		var keys = Object.keys(currentCol).map(Number).filter(function(a){
			return isFinite(a) && currentCol[a] && currentCol[a].len > 0;
		});
		currentCol.minRow = Math.min.apply(Math, keys);
		currentCol.maxRow = Math.max.apply(Math, keys);
	}
	var keys = Object.keys(myMap).map(Number);
	keys = keys.filter(function(a){
			return isFinite(a) && myMap[a] && isFinite(myMap[a].minRow);
	});
	
	//todo: update minx, maxx etc
	
	this.minCol = Math.min.apply(Math, keys);
	this.maxCol = Math.max.apply(Math, keys);
};
NewHashMap.prototype.search = function (rect, filter) {
	//Optional parameter handling
	if (filter === undefined) filter = true;
	
	var me = this;
	var found = me.entries.filter(function(entry){
		return me.isContainedBy(entry, keys);
	});
	if (!filter){return results}
	
	//TODO: filter and phase old shit out
	var results = [];
	var currentCol, currentRow, startRow, endRow, col, row;
	var keys = this.key(rect);
	var startCol = Math.max(keys.x1, this.minCol);
	var endCol = Math.min(keys.x2, this.maxCol);
	
	

	for (col = startCol; col <= endCol; col++) {
		currentCol = this.map[col];
		if (!currentCol) continue;

		startRow = Math.max(keys.y1, currentCol.minRow);
		endRow = Math.min(keys.y2, currentCol.maxRow);
		for (row = startRow; row <= endRow; row++) {
			currentRow = currentCol[row];
			if (currentRow) {
				results = results.concat(currentRow);
			}
		}
	}
	if (!filter){return results}
	
	var i, obj, id, finalresult = [], found = {};
	var len = results.length;
	for (i = 0; i < len; i++) {
		obj = results[i];
		if (!obj) continue;

		id = obj[0];
		if (!found[id] && obj.x < rect._x + rect._w && obj._x + obj._w > rect._x && obj.y < rect._y + rect._h && obj._h + obj._y > rect._y) {
			found[id] = results[i];
		}
	}
	for (obj in found) {
		finalresult.push(found[obj]);
	}
	return finalresult;
	
};
NewHashMap.prototype.boundaries = function () {
	return {
		max: {x: this.maxX, y: this.maxY},
		min: {x: this.minX, y: this.minY}
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