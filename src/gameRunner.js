/**
 * Created by lhunker on 10/10/15.
 * Runs a given game until a player wins based off simple heuristics
 */
var utility = require('./utility');
var _ = require('underscore');

/**
 * Builds a new GameRunner class
 * @param board A game board to use
 * @param players the game's players Assumes players already have initial structures
 *      Assumes the player we want results for is in index 0
 * @constructor
 */
function GameRunner(board, players){
    this.board = board; //TODO make sure this is a copy that can be changed
    this.players = players;

}

/**
 * Run the game until a player wins
 * @return true if player 0 won false otherwise
 */
GameRunner.prototype.run = function run(){
    var currentTurn = _.random(0, 3);
    while(!isWinner(this.players)){
        var die1 = _.random(1, 6);
        var die2 = _.random(1, 6);
        var roll = die1 + die2;
        //Distribute resources
        this.players.forEach(function(p){
            p.handleRoll(roll);
        });

        //Find player with current turn, player takes turn
        this.players[currentTurn].makeMove();
        currentTurn = currentTurn === 3 ? 0 : currentTurn +1;
    }
    //Figure out which player won, output state
    var winner = isWinner(players);
    return winner === 0;

};

/**
 * Determines if there is currently a winner
 * @returns {boolean} player number if there is a winner, false otherwise
 */
function isWinner(players){
    for(var i = 0; i < 4; i++){
        if(players[i].victoryPoints >= 10){
            return i;
        }
    }
    return false;
}

module.exports = GameRunner;
