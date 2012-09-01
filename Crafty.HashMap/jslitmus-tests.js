// Test inits
var mapWithElements = new HashMap();
var newMapWithElements = new NewHashMap();
for (var x=1; x <= 768; x++) {
	mapWithElements.insert({
		_x : x*mapWithElements.cellsize,
		_y : x*mapWithElements.cellsize,
		_w : 64,
		_h : 64
	});
	newMapWithElements.insert({
		_x : x*newMapWithElements.cellsize,
		_y : x*newMapWithElements.cellsize,
		_w : 64,
		_h : 64
	});
};

// Tests
JSLitmus.test("New Hashmap insert", function (count) {
	var map;
	while(count--){		
		map = new NewHashMap();
		for (var x=1; x <= count; x++) {
			map.insert({
				_x : x*mapWithElements.cellsize,
				_y : x*mapWithElements.cellsize,
				_w : mapWithElements.cellsize,
				_h : mapWithElements.cellsize
			});
		};
	};
});
JSLitmus.test("Old Hashmap insert", function (count) {
	var map;
	while(count--){		
		map = new HashMap();
		for (var x=1; x <= count; x++) {
			map.insert({
				_x : x*mapWithElements.cellsize,
				_y : x*mapWithElements.cellsize,
				_w : mapWithElements.cellsize,
				_h : mapWithElements.cellsize
			});
		};
	};
});


JSLitmus.test("New Hashmap search", function (count) {
	while(count--){		
		newMapWithElements.search({
			_x : count,
			_y : count,
			_w : 1,
			_h : 1
		});
	};
});
JSLitmus.test("Old Hashmap search", function (count) {
	while(count--){				
		mapWithElements.search({
			_x : count,
			_y : count,
			_w : 1,
			_h : 1
		});
	};
});

JSLitmus.test("New Hashmap boundaries", function (count) {
	while(count--){		
		newMapWithElements.boundaries();
	};
});
JSLitmus.test("Old Hashmap boundaries", function (count) {
	while(count--){				
		mapWithElements.boundaries();
	};
});