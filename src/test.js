var utility = require('./utility');
var Board = require('./board');

utility.loadBoard("file", function(tiles) {
    var board = new Board();
    board.addTiles(tiles);
    board.printBoard();
});
