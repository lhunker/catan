var Board = require('./board');
var utility = require('./utility');
var Player = require('./player');
var heuristic = require('./heuristics');
var GameRunner = require('./gameRunner');
var _ = require('underscore');
var ROLLOUTS = 100;

/**
 * Main file for the application
 **/
var board = new Board();
var tiles = utility.createBoard();
board.addTiles(tiles);

board.printBoard();

//Make player 1
var me = new Player(heuristic.h2DiversifyResources, board, 0);
var players = [];

//For now assume other players use h1
players.push(me);
for (var i = 1; i < 4; i++){
    var nextPlayer = new Player(heuristic.h1MostResources, board, i);
    players.push(nextPlayer);
}
//doInitialPlacements();
doInitialPlacementsRollout();
var wins = doRollout(board, players, 100);

console.info('Player won ' + wins + ' times');

/**
 * Performs the initial settlement placement
 */
function doInitialPlacements(){
    var placing = _.random(0, 3);
    for(var i = 0; i < 4; i++){
        players[placing].buildSettlement(true);
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
 * @param localBoard the Board to use
 * @param localPlayers the Players to use
 * @param num the number of rollouts to do
 * @returns {number} The number of games the player won
 */
function doRollout(localBoard, localPlayers, num){
    var won = 0;
    for(var i = 0; i < num; i++) {
        //copy everything
        var bClone = utility.cloneBoard(localBoard);
        var pClone = [];
        for (var j = 0; j < 4; j++) {
            pClone.push(utility.clonePlayer(localPlayers[j], bClone, localPlayers[j].number));
        }

        var runner = new GameRunner(bClone, pClone);
        var res = runner.run();

        if (res) {
            //console.info('won');
            won++;
        }else{
            //console.info('loss');
        }
    }
    return won;
}

/**
 * Performs the initial settlement placement using rollouts to evaluate player position
 */
function doInitialPlacementsRollout(){
    var placing = _.random(0, 3);
    for(var i = 0; i < 4; i++){
        if(placing === 0){
            var possible = players[placing].getBestIntersection(5);
            var selected = selectionRollout(1, i, possible);
            players[placing].buildSettlement(true, selected);
        } else {
            players[placing].buildSettlement(true);
        }
        placing = placing === 3 ? 0 : placing +1;
    }
    for(i = 0; i < 4; i++){
        if(placing === 0){
            possible = players[placing].getBestIntersection(5);
            selected = selectionRollout(2, i, possible);
            players[placing].buildSettlement(true, selected);
        } else {
            players[placing].buildSettlement(true);
        }
        //TODO add resources from settlement
        placing = placing === 0 ? 3 : placing -1;
    }
}

/**
 * Do rollouts for selecting a move
 * @param loopNum which loop we are on (1 or 2) based on if we've already placed a settlement
 * @param i the counter of the player placement loop
 * @param intersections the intersections to test
 * @returns {*} the best intersection
 */
function selectionRollout(loopNum, i, intersections) {
    var maxWon = 0;
    var maxInt = intersections[0];
    for (var j = 0; j < intersections.length; j++){
        //copy everything
        var bClone = utility.cloneBoard(board);
        var pClone = [];
        for (var k = 0; k < 4; k++) {
            pClone.push(utility.clonePlayer(players[k], bClone, players[k].number));
        }

        pClone[0].buildSettlement(true, intersections[j]);

        //Do remaining placements
        var placing = 0;
        if (loopNum === 1){
            for(; i < 4; i++){
                players[placing].buildSettlement(true);
                placing = placing === 3 ? 0 : placing +1;
            }
            i = 0;
        }
        for(; i < 4; i++){
            players[placing].buildSettlement(true);
            placing = placing === 0 ? 3 : placing -1;
        }

        //Do Rollouts
        var wonPer = doRollout(bClone, pClone, ROLLOUTS);
        if (wonPer > maxWon){
            maxWon = wonPer;
            maxInt = intersections[j];
        }
    }
    return maxInt;
}