var boxWidth = 32;
var boxHeight = 32;
var boardLeft = 0;
var boardTop = 0;
var boardCols = 10;
var boardRows = 8;

window.onload = (function () {
    Crafty.init();
    Crafty.e("TiledLevel").tiledLevel("./maps/grassAndWater.json", "DOM");
});