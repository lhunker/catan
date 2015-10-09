var Board = require('./board.js');
var utility = require('./utility.js');

/**
 * Main file for the application
 **/
var board = new Board();
var tiles = utility.createBoard();
board.addTiles(tiles);

board.printBoard();

