/**
 * Created by lhunker on 10/10/15.
 * A game player class
 */

/**
 * Makes a player
 * @constructor
 * @param placement a function containing the heuristic for placement
 * @param board the game board
 * TODO figure out what data is needed
 */

var utility = require('./utility');
var _ = require('underscore');

function Player(placement, board, number){
    this.placement = placement;
    var resources = {sheep: 0, wood: 0, ore: 0, brick: 0, straw: 0};
    this.resourceMap = [];
    for (var i = 2; i <= 12; i++){
        this.resourceMap[i] = _.clone(resources);
    }
    this.resources = resources;
    this.victoryPoints = 0;
    this.board = board;
    this.number = number;
}

/**
 * Perform move for specific turn
 */
Player.prototype.makeMove = function(){
  var func = moveHeuristic.bind(this, this.resources);
    func();
};

/**
 * Handle adding resources and such per roll
 * @param roll the number rolled
 */
Player.prototype.handleRoll = function (roll){
    var _this = this;
    this.resources = _.mapObject(this.resources, function(val, key){
        return val + _this.resourceMap[roll][key];
    });
};

/**
 * Adds a structure to the resource
 * @param rMap the array of maps of resource pairs [{roll, resource}]
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
 * @return [] Intersection to build a settlement at
 */
Player.prototype.getBestIntersection = function() {
    var intersections = this.board.intersections;
    var maxHeuristicValue = -999999;
    var maxIntersect = [];
    for (var i = 0; i < intersections.length; i++) {
        var intersect = intersections[i];
        // Check that intersection is buildable and has a better score than the current best
        if (this.board.isIntersectionBuildable(intersect)) {
            var value = this.placement(intersect, this.board, this.resources, this);
            if (value > maxHeuristicValue) {
                maxHeuristicValue = value;
                maxIntersect = intersect;
            }
        }
    }

    return maxIntersect;
};

Player.prototype.getBestSettlement = function(){
    var structures = this.board.structures;
    var maxHeuristicValue = -999999;
    var maxIntersect = [];
    var _this = this;

    _.each(structures, function (s){
        if(s.player.number === _this.number && s.type === 'settlement'){  //TODO this might not work
            var value = _this.placement(s.int, _this.board, _this.resources, _this);
            if (value > maxHeuristicValue) {
                maxHeuristicValue = value;
                maxIntersect = s.int;
            }
        }
    });

    return maxIntersect;
};

/**
 * Determine which move is best
 * @param resources the player's current resources
 */
function moveHeuristic(resources){
    if(canBuildSettlement(resources)){
        this.buildSettlement();
    } else if (canBuildCity(resources)){
        this.buildCity();
    }
}

//TODO handle 4 to 1 trades
/**
 * Determine if there are enough resources to build a settlement
 * @param resources The player's current resources
 * @return {boolean} true if a settlement can be built, false anyways
 */
function canBuildSettlement (resources){
    // If have enough already, just build it
    //console.log(resources);
    if (resources.wood > 0 && resources.brick > 0 && resources.straw > 0 && resources.sheep > 0) return true;
    var res = ['wood', 'brick', 'straw', 'sheep'];
    // Otherwise check deficiencies
    for (var i = 0; i < 4; i++) {
        if (resources[res[i]] !== 0) continue;
        // Try getting rid of ore first because that doesn't affect the rest of the settlement reqs
        if (resources.ore >= 4) {
            //console.log("Traded 4 ore for 1 " + res[i]);
            resources.ore -= 4;
            resources[res[i]]++;
        } else {
            // Otherwise check if over 5 of any given resource
            for (var j = 0; j < 4; j++) {
                if (resources[res[j]] >= 5) {
                    //console.log("Traded 4 " + res[j] + " for 1 " + res[i]);
                    resources[res[j]] -= 4;
                    resources[res[i]]++;
                    break;
                }
            }
        }

        // If still don't have resource, then can't get it
        if (resources[res[i]] === 0) return false;
    }

    return true;
}

/**
 * Determine if the player can build a city
 * @param resources the player's current resources
 * @returns {boolean} true if the player can build a city, false otherwise
 */
function canBuildCity (resources){
    return resources.straw >= 2 && resources.ore >= 3;
}

/**
 * Handles the creation of a settlement
 * @param beginningOfGame
 * @param intersection optional, the intersection to place the settlement at
 */
Player.prototype.buildSettlement = function(beginningOfGame, intersection){
    if (!beginningOfGame) {
        this.resources.wood -= 1;
        this.resources.brick -= 1;
        this.resources.straw -= 1;
        this.resources.sheep -= 1;
    }
    var intersectionToUse;
    if (intersection){
        intersectionToUse = intersection;
    }
    else {
        intersectionToUse = this.getBestIntersection();
    }
    var structs = utility.makeStructure(intersectionToUse, this, 'settlement');
    this.board.addStructures([structs]);
    var rMap = this.board.getIntersectionDist(intersectionToUse);
    this.addStructure(rMap);
    this.victoryPoints++;
};

/**
 * Handles the creation of a city
 */
Player.prototype.buildCity = function(){
    this.resources.straw -= 2;
    this.resources.ore -= 3;
    var intersection = this.getBestSettlement(this.board); // TODO: make it so that cities can only replace settlements
    if(intersection.length !== 0 && intersection !== []){
        //console.info('Building city ' + this.number);
        var structs = utility.makeStructure(intersection, this, 'city');
        this.board.addStructures([structs]);
        var rMap = this.board.getIntersectionDist(intersection);
        this.addStructure(rMap);
        this.victoryPoints += 1;
    }

};

module.exports = Player;
