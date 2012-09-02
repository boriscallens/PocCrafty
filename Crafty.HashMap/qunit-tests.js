/*test("map.insert one entity with x, y, w and h = 1 should insert it at 0,0",1 , function(){
	var myMap = new NewHashMap();
	var entity = {_x:1, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0][0][0].obj, entity);
});
test("map.insert one entity with x and y cellsize+1 and h = 1 should insert it at 1,1",1 , function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	var entity = {_x:size, _y:size, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[1][1][0].obj, entity);
});
test("map.insert 10 entities on position < cellsize should insert all of them at position 0", 10, function(){
	var myMap = new NewHashMap();
	for (var index = 0; index < 10; index++){
		var entity = {_x:index, _y:index, _w:1, _h:1}
		myMap.insert(entity);
		equal(myMap.map[0][0][index].obj, entity);
	}
});
test("map.insert 1 entity of 3 tiles wide should insert same object in 3 cells", 3, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	var entity = {_x:1, _y:1, _w:size*3, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0][0][0].obj, entity);
	equal(myMap.map[1][0][0].obj, entity);
	equal(myMap.map[2][0][0].obj, entity);
});
test("map.insert should correctly update mincol", 3, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	
	var entity = {_x:size*4, _y:size*4, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.minCol, 4);
	
	var entity = {_x:size*3, _y:size*3, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.minCol, 3);
	
	var entity = {_x:size*99, _y:size*99, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.minCol, 3);
});
test("map.insert should correctly update maxcol", 3, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	
	var entity = {_x:size*3, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.maxCol, 3);
	
	var entity = {_x:size*4, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.maxCol, 4);
	
	var entity = {_x:size*2, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.maxCol, 4);
});
test("map.insert should correctly update minRow", 3, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	
	var entity = {_x:1, _y:size*4, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0].minRow, 4);
	
	var entity = {_x:1, _y:size*3, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0].minRow, 3);
	
	var entity = {_x:1, _y:size*5, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0].minRow, 3);
});
test("map.insert should correctly update maxRow", 3, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	
	var entity = {_x:1, _y:size*2, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0].maxRow, 2);
	
	var entity = {_x:1, _y:size*3, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0].maxRow, 3);
	
	var entity = {_x:1, _y:size*1, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0].maxRow, 3);
});*/
test("map.remove should correctly remove the entry", 2, function(){
	var myMap = new NewHashMap();
	var entity = {_x:1, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	equal(myMap.map[0][0][0].obj, entity);
	
	myMap.remove(entity);
	equal(myMap.map[0][0][0], undefined);
});
/*test("map.remove should remove the entry at all the right depth", 6, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize
	var entity = {_x:1, _y:1, _w:1, _h:1}
	myMap.insert(entity);
	myMap.insert(entity);
	myMap.insert(entity);
	equal(myMap.map[0][0][0].obj, entity);
	equal(myMap.map[0][0][1].obj, entity);
	equal(myMap.map[0][0][2].obj, entity);
	
	myMap.remove(entity);
	equal(myMap.map[0][0][0], undefined);
	equal(myMap.map[0][0][1], undefined);
	equal(myMap.map[0][0][2], undefined);
});
test("map.remove should correctly update mincol", 3, function(){
	var myMap = new NewHashMap();
	var size = myMap.cellsize;
	
	var entity1 = {_x:size*2, _y:1, _w:1, _h:1}
	var entity2 = {_x:size*3, _y:1, _w:1, _h:1}
	var entity3 = {_x:size*4, _y:1, _w:1, _h:1}
	myMap.insert(entity1);
	myMap.insert(entity2);
	myMap.insert(entity3);
	
	equal(myMap.minCol, 2);
	
	myMap.remove(entity2);
	equal(myMap.minCol, 2);
	
	myMap.remove(entity1);
	equal(myMap.minCol, 4);
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
});*/