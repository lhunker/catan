var Utility = require('./utility.js');

/**
 * Main file for the application
 **/
var utility = new Utility();
var tiles = utility.createBoard();
for (var i = 0; i < tiles.length; i++) {
    console.log(tiles[i].toString());
}
