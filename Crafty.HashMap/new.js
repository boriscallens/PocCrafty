function NewHashMap(cell){
	this.map = {};
	this.cellsize = cell || 64;
	this.minX = Infinity;
	this.maxX = - Infinity;
	this.minY = Infinity;
	this.maxY = - Infinity
	this.entries = [];
	this.columns = [];
	this.rows = [];
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

	this.minX = Math.min(this.minX, obj._x);
	this.minY = Math.min(this.minY, obj._y);
	this.maxX = Math.max(this.maxX, obj._x + obj._w);
	this.maxY = Math.max(this.maxY, obj._y + obj._h);
	
	this.entries.push(entry);
	for(var i = keys.x1; i <= keys.x2; i++){
		if(!this.columns[i]){this.columns[i] = []};
		this.columns[i].push(entry);
	}
	for(var i = keys.y1; i <= keys.y2; i++){
		if(!this.rows[i]){this.rows[i] = []};
		this.rows[i].push(entry);
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
	
	// remove the obj from the entries
	me.entries = me.entries.filter(function(entry){
		return me.isContainedBy(entry, keys) && entry.obj !== obj;
	});
	// remove it from column and row
	for(var i = keys.x1; i <= keys.x2; i++){
		if(this.columns[i]){
			this.columns[i] = this.columns[i].filter(function(entry){
				return me.isContainedBy(entry, keys) && entry.obj !== obj;
			});
		};
	}
	for(var i = keys.y1; i <= keys.y2; i++){
		if(this.rows[i]){
			this.rows[i] = this.rows[i].filter(function(entry){
				return me.isContainedBy(entry, keys) && entry.obj !== obj;
			});
		};
	}
	
	// recalculate minX, maxX, minY and maxY	
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
};
NewHashMap.prototype.search = function (rect, filter) {
	//Optional parameter handling
	if (filter === undefined) filter = true;
	
	var me = this;
	var keys = this.key(rect);
	
	// Get the elements in the correct rows
	var rows = this.rows.slice(keys.x1, keys.x2);
	if(rows.length == 0){return;};
	
	// Get the elements in the correct columns
	var cols = this.columns.slice(keys.y1, keys.y2);
	if(cols.length == 0){return;}
	
	// Get all the elements, sorted and no nulls
	var colElements = [].concat.apply([], cols).filter(function(a){return a});
	var rowElements = [].concat.apply([], rows).filter(function(a){return a});
	
	var intersection =  getIntersect(colElements, rowElements);
	return intersection;	
	// Not sure where to put this..
	function getIntersect(arr1, arr2) {
		var r = [], o = {}, l = arr2.length, i, v;
		for (i = 0; i < l; i++) {
			o[arr2[i]] = true;
		}
		l = arr1.length;
		for (i = 0; i < l; i++) {
			v = arr1[i];
			if (v in o) {
				r.push(v);
			}
		}
		return r;
	}
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