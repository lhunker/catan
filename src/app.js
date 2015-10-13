var Board = require('./board.js');
var utility = require('./utility.js');
var _ = require('underscore');

/**
 * Main file for the application
 **/
var board = new Board();
var tiles = utility.createBoard();
board.addTiles(tiles);

board.printBoard();

console.info(board.getResources([{x:1, y:0}, {x:2, y:0}, {x:2, y:1}]));

