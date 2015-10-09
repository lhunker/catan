var Board = require('./board.js');
var utility = require('./utility.js');

/**
 * Main file for the application
 **/
var board = new Board();
var tiles = utility.createBoard();
board.addTiles(tiles);
for (var i = 0; i < board.tiles.length; i++) {
    console.log(board.tiles[i].toString());
}
