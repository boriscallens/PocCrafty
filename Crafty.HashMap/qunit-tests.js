test("map.insert one entity with x, y, w and h = 1 should insert it in the entries, column and rows",3 , function(){
	var myMap = new NewHashMap();
	var entity = {_x:1, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	
	equal(myMap.entries[0].obj, entity);
	equal(myMap.columns[0][0].obj, entity);
	equal(myMap.rows[0][0].obj, entity);
});	
test("map.insert one entity with x and y cellsize+1 and h = 1 should insert it at column 1, row 1",3 , function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	var entity = {_x:size, _y:size, _w:1, _h:1}
	myMap.insert(entity);
	
	equal(myMap.entries[0].obj, entity);
	equal(myMap.columns[1][0].obj, entity);
	equal(myMap.rows[1][0].obj, entity);
});
test("map.insert 10 entities on position < cellsize should insert all of them at column 0, row 0", 30, function(){
	var myMap = new NewHashMap();
	for (var index = 0; index < 10; index++){
		var entity = {_x:index, _y:index, _w:1, _h:1}
		myMap.insert(entity);
		
		equal(myMap.entries[index].obj, entity);
		equal(myMap.columns[0][index].obj, entity);
		equal(myMap.rows[0][index].obj, entity);
	}
});
test("map.insert 1 entity of 3 tiles wide should insert same object in 3 cells", 7, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	var entity = {_x:0, _y:0, _w:size*3-1, _h:1}
	myMap.insert(entity);
	
	equal(myMap.entries.length, 1);
	equal(myMap.columns.length, 3);
	equal(myMap.rows.length, 1);
	
	equal(myMap.columns[0][0].obj, entity);
	equal(myMap.columns[1][0].obj, entity);
	equal(myMap.columns[2][0].obj, entity);
	equal(myMap.rows[0][0].obj, entity);
});
test("map.insert should correctly update minx, max, miny, maxy", 16, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	
	var entity = {_x:0, _y:0, _w:0, _h:0}
	myMap.insert(entity);
	equal(myMap.minX, 0);
	equal(myMap.minY, 0);
	equal(myMap.maxX, 0);
	equal(myMap.maxX, 0);
	
	var entity = {_x:10, _y:10, _w:0, _h:0}
	myMap.insert(entity);
	equal(myMap.minX, 0);
	equal(myMap.minY, 0);
	equal(myMap.maxX, 10);
	equal(myMap.maxX, 10);
	
	var entity = {_x:10, _y:10, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.minX, 0);
	equal(myMap.minY, 0);
	equal(myMap.maxX, 11);
	equal(myMap.maxX, 11);
	
	var size = myMap.cellsize
	var entity = {_x:0, _y:0, _w:110, _h:110}
	myMap.insert(entity);
	equal(myMap.minX, 0);
	equal(myMap.minY, 0);
	equal(myMap.maxX, 110);
	equal(myMap.maxX, 110);
});
test("map.remove should correctly remove the entry", 3, function(){
	var myMap = new NewHashMap();
	var entity = {_x:1, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	myMap.remove(entity);
	
	equal(myMap.entries.length, 0);
	equal(myMap.columns[0].length, 0);
	equal(myMap.rows[0].length, 0);
});
test("map.remove should remove the all the matching entries", 6, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	var entity = {_x:1, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	myMap.insert(entity);
	myMap.insert(entity);
	equal(myMap.entries[0].obj, entity);
	equal(myMap.entries[1].obj, entity);
	equal(myMap.entries[2].obj, entity);
	
	myMap.remove(entity);
	equal(myMap.entries[0], undefined);
	equal(myMap.entries[1], undefined);
	equal(myMap.entries[2], undefined);
});
test("map.search without filter should only return result at searched location", function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize;
	
	var entity1 = {_x:1, _y:1, _w:1, _h:1}
	var entity2 = {_x:2*size, _y:1, _w:1, _h:1}
	var entity3 = {_x:1,      _y:2*size, _w:1, _h:1}
	var entityX = {_x:20*size, _y:1, _w:1, _h:1}
	
	var rect = {_x:0, _y:0, _w:size*3, _h:size*3}
	myMap.insert(entity1);
	myMap.insert(entity2);
	myMap.insert(entity3);
	myMap.insert(entityX);
		
	var searchResult = myMap.search(rect, false)
	equal(searchResult.length, 3);
	equal(searchResult[0].obj, entity1);
	equal(searchResult[1].obj, entity3);
	equal(searchResult[2].obj, entity2);
});
// Don't really get what the filter function is for
// TODO: what?
// test("map.search with filter should only return objects at location that pass through the filter", function(){
	// var myMap = new NewHashMap();
	// var size = myMap.cellsize;
	
	// var entity1 = {_x:1, _y:1, _w:1, _h:1}
	// var entity2 = {_x:2*size, _y:1, _w:1, _h:1}
	// var entity3 = {_x:1,      _y:2*size, _w:1, _h:1}
	// var entityX = {_x:20*size, _y:1, _w:1, _h:1}
	
	// var rect = {_x:0, _y:0, _w:size*3, _h:size*3};
	// myMap.insert(entity1);
	// myMap.insert(entity2);
	// myMap.insert(entity3);
	// myMap.insert(entityX);
		
	// var searchResult = myMap.search(rect, entity2)
	// equal(searchResult.length, 1);
	// equal(searchResult[0].obj, entity2);
// });
test("boundaries for one entity should correctly give boundaries", function(){
	var myMap = new NewHashMap();
		
	var entity1 = {_x:10, _y:10, _w:1, _h:1}
	var expected = {
        max: {x: 11, y: 11},
        min: {x: 10, y: 10}
    };
	
	myMap.insert(entity1);
	var boundaries = myMap.boundaries();
		
	deepEqual(boundaries, expected);
});

test("boundaries for two entities should correctly give boundaries", function(){
	var myMap = new NewHashMap();
			
	var entity1 = {_x:1, _y:1, _w:1, _h:1}
	var entity2 = {_x:1234, _y:1, _w:1, _h:1}
	var expected = {
        max: {x: 1235, y: 2},
        min: {x: 1, y: 1}
    };
	
	myMap.insert(entity1);
	myMap.insert(entity2);
	var boundaries = myMap.boundaries();
		
	deepEqual(boundaries, expected);
});