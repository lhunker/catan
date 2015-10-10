/**
 * Created by lhunker on 10/10/15.
 * Runs a given game until a player wins based off simple heuristics
 */


/**
 * Builds a new GameRunner class
 * @param board A game board to use
 * TODO either take in players or create or put in board?
 * @constructor
 */
function GameRunner(board){
    this.board = board; //TODO make sure this is a copy that can be changed
}

/**
 * Run the game until a player wins
 * @return the winning player  TODO format TBD
 */
GameRunner.prototype.run = function run(){
    while(!isWinner()){
        //Distribute resources

        //Find player with current turn, player takes turn
    }
    //Figure out which player won, output state
};

/**
 * Determines if there is currently a winner
 * @returns {boolean} true if there is a winner, false otherwise
 */
function isWinner(){
    //TODO implement function
    return false;
}

module.exports = GameRunner;