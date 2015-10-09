var Board = require('./board.js');
var Utility = require('./utility.js');

/**
 * Main file for the application
 **/
var board = new Board();
var utility = new Utility();
board.tiles = utility.createBoard();
for (var i = 0; i < board.tiles.length; i++) {
    console.log(board.tiles[i].toString());
}
