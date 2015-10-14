var Board = require('./board');
var utility = require('./utility');
var Player = require('./player');
var heuristic = require('./heuristics');
var GameRunner = require('./gameRunner');
var _ = require('underscore');

/**
 * Main file for the application
 **/
var board = new Board();
var tiles = utility.createBoard();
board.addTiles(tiles);

board.printBoard();

//Make player 1
var me = new Player(heuristic.h3RoadsEarlyCitiesLate, board, 0);
var players = [];

//For now assume other players use h1
players.push(me);
for (var i = 1; i < 4; i++){
    var nextPlayer = new Player(heuristic.h1MostResources, board, i);
    players.push(nextPlayer);
}
doInitialPlacements();

var wins = doRollout(board, players, 100);

console.info('Player won ' + wins + ' times');

/**
 * Performs the initial settlement placement
 */
function doInitialPlacements(){
    var placing = _.random(1, 3);
    //TODO maybe do something special for our player
    for(var i = 0; i < 4; i++){
        players[placing].buildSettlement(true);   //TODO check params
        placing = placing === 3 ? 0 : placing +1;
    }
    for(i = 0; i < 4; i++){
        players[placing].buildSettlement(true);
        //TODO add resources from settlement
        placing = placing === 0 ? 3 : placing -1;
    }
}

/**
 * Perform rollouts to see who won
 * @param board the board to use
 * @param players the players to use
 * @param num the number of rollouts to do
 * @returns {number} The number of games the player won
 */
function doRollout(board, players, num){
    var won = 0;
    for(var i = 0; i < num; i++) {
        //copy everything
        var bClone = utility.cloneBoard(board);
        var pClone = [];
        for (var j = 0; j < 4; j++) {
            pClone.push(utility.clonePlayer(players[j], bClone, players[j].number));
        }

        var runner = new GameRunner(bClone, pClone);
        var res = runner.run();

        if (res) {
            console.info('won');
            won++;
        }else{
            console.info('loss');
        }
    }
    return won;
}
