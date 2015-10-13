/**
 * Created by lhunker on 10/10/15.
 * A game player class
 */

/**
 * Makes a player
 * @constructor
 * @param placement a function containing the heuristic for placement
 * TODO figure out what data is needed
 */

var _ = require('underscore');

function Player(placement){
    this.placement = placement;
    var resources = {sheep: 0, wood: 0, ore: 0, brick: 0, straw: 0};
    this.resourceMap = [];
    for (var i = 2; i <= 12; i++){
        this.resourceMap[i] = _.clone(resources);
    }
    this.resources = resources;
    this.victoryPoints = 0; // TODO: add victory points
}

/**
 * Perform move for specific turn
 * TODO figure out parameters
 */
Player.prototype.makeMove = function(){
  //TODO implement function
};

/**
 * Handle adding resources and such per roll
 * @param roll the number rolled
 */
Player.prototype.handleRoll = function (roll){
    //TODO test function
    var _this = this;
    this.resources = _.mapObject(this.resources, function(val, key){
        return val + _this.resourceMap[roll][key];
    });
};

/**
 * Adds a structure to the resource
 * @param rMap the map of resource pairs {roll, resource}
 * TODO handle cities too
 */
Player.prototype.addStructure = function (rMap) {
    var _this = this;
    rMap.forEach(function(r){
        var current = r.resource;
        var roll = r.roll;
        if(current === 'wood'){
            _this.resourceMap[roll].wood++;
        }else if (current === 'ore'){
            _this.resourceMap[roll].ore++;
        }else if (current === 'brick'){
            _this.resourceMap[roll].brick++;
        }else if (current === 'straw'){
            _this.resourceMap[roll].straw++;
        }else {
            _this.resourceMap[roll].sheep++;
        }
    });
};

/**
 * @param board to use for determining settlement location
 * @return [] Intersection to build a settlement at
 */
Player.prototype.getBestIntersection = function(board) {
    var intersections = board.intersections;
    var maxHeuristicValue = 0;
    var maxIntersect = NaN;
    for (var i = 0; i < intersections.length; i++) {
        var intersect = intersections[i];
        // Check that intersection is buildable and has a better score than the current best
        if (board.isIntersectionBuildable(intersect)) {
            var value = this.placement(intersect);
            if (value > maxHeuristicValue) {
                maxHeuristicValue = value;
                maxIntersect = intersect;
            }
        }
    }

    return maxIntersect
}

/**
 * Determine which move is best
 * @param resources the player's current resources
 */
function moveHueristic(resources){
    if(buildSettlement(resources)){
        //build settlements
    } else if (buildCity(resources)){
        //build city
    }
}

//TODO handle 4 to 1 trades
/**
 * Determine if there are enough resources to build a settlement
 * @param resources The player's current resources
 * @return true if a settlement can be built, false anyways
 */
Player.prototype.buildSettlement = function (resources){
    return resources.wood > 0 && resources.brick > 0 && resources.straw > 0 && resources.sheep >0;
}

/**
 * Determine if the player can build a city
 * @param resources the player's current resources
 * @returns {boolean} true if the player can build a city, false otherwise
 */
Player.prototype.buildCity = function (resources){
    return resources.straw >= 2 && resources.ore >= 3;
}

module.exports = Player;
