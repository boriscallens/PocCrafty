// Crafty.c("Terrain", {
	// init: function(){
		// var iso = Crafty.isometric.size(128);
		// var area = iso.area();
		
		// for (var y = area.y.start; y <= area.y.end+2; y++){
			// for (var x = area.x.end+1; x >= area.x.start; x--){
				// iso.place(x-1, y-1, 0, Crafty.e("TerrainTile"));
			// }
		// };
		// this.bind("mouseover", function() {
			// console.log("Terrain");
		// });		
	// }
// });
// Crafty.c("TerrainTile", {
	// init: function(){
		// var _tileType = Crafty.math.randomElementOfArray(["grass", "stone"]);
		// this.addComponent("2D, DOM, " + _tileType),
		// this.bind("mouseover", function() {
			// console.log("test");
			// // if(this.has("grass")){
				// // this.toggleComponent("grass, grassHover");
				
			// // }
		// });
	// }
// });

// Crafty.c("Box", {
	// init: function(){
		// this.addComponent ("2D, Canvas, Color, Mouse");
		// this.w = boxWidth;
		// this.h = boxHeight;
		
		// this.bind("Click", function(obj){
			// if(this._onClickCallback)
				// this._onClickCallback({
					// x: obj.realX,
					// y: obj.realY,
					// color: this._color
				// });
		// });			
	// },
	// makeBox: function(x, y, color, onClickCallback){
		// this.attr({x: x, y: y})
			// .color(color);
		// this._onClickCallback = onClickCallback;
		// return this;
	// }
// });
	
// Crafty.c("Board", {
	// init: function(){
		// this.addComponent("2D, Canvas");
		// this.x = boardLeft;
		// this.y = boardTop;
		// this.w = boxWidth * boardCols;
		// this.h = boxHeight * boardRows;
		// this.color("#888");
		// this._setupBoard(boardLeft, boardTop, boardRows, boardCols, boxWidth, boxHeight);
	// },
	// _setupBoard: function(x, y, rows, cols, bw, bh){
		// this._board = [cols,rows];
		// for (var c = 0; c < cols; c++){
			// for (var r = 0; r < rows; r++){
				// // capture current context
				// var that = this;
				// var newBox = Crafty.e("Box")
								// .makeBox(
									// x + c * boxWidth,
									// y + (boxHeight * boardRows - (r+1) * boxHeight),
									// Crafty.math.randomElementOfArray(this.COLORS),
									// function(){
										// that._clickHandler.apply(that, arguments);
									// }
								// );
				// this._board[c,r] = newBox;
			// }
		// }
	// },
	// _clickHandler: function(obj){
		// var pos = this._translateToArrayPos(obj.x, obj.y);
		// console.log(pos);
	// },
	// _translateToArrayPos: function(x, y){
		// return {
			// x : Math.floor((x - boardLeft) / boxWidth),
			// y : (boardRows - 1) - Math.floor((y - boardTop) / boxHeight)
		// };
	// }
// });
