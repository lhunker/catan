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
        if(s.player === _this && s.type === 'settlement'){  //TODO this might not work
            var value = _this.placement(s.int, _this.board, _this.resources, _this);
            if (value > maxHeuristicValue) {
                maxHeuristicValue = value;
                maxIntersect = intersect;
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
        // TODO: make it that cities can only replace settlements
        //this.buildCity();
        this.canBuildCity(resources);
    }
}

//TODO handle 4 to 1 trades
/**
 * Determine if there are enough resources to build a settlement
 * @param resources The player's current resources
 * @return {boolean} true if a settlement can be built, false anyways
 */
function canBuildSettlement (resources){
    return resources.wood > 0 && resources.brick > 0 && resources.straw > 0 && resources.sheep >0;
}

/**
 * Determine if the player can build a city
 * @param resources the player's current resources
 * @returns {boolean} true if the player can build a city, false otherwise
 */
function canBuildCity (resources){
    return resources.straw >= 2 && resources.ore >= 3;
}

Player.prototype.buildSettlement = function(beginningOfGame){
    if (!beginningOfGame) {
        this.resources.wood -= 1;
        this.resources.brick -= 1;
        this.resources.straw -= 1;
        this.resources.sheep -= 1;
    }
    var intersection = this.getBestIntersection(this.board);
    var structs = utility.makeStructure(intersection, this, 'settlement');
    this.board.addStructures([structs]);
    var rMap = this.board.getIntersectionDist(intersection);
    this.addStructure(rMap);
    this.victoryPoints++;
};

Player.prototype.buildCity = function(){
    this.resources.straw -= 2;
    this.resources.ore -= 3;
    var intersection = this.getBestIntersection(this.board); // TODO: make it so that cities can only replace settlements
    var structs = utility.makeStructure(intersection, this, 'city');
    this.board.addStructures([structs]);
    var rMap = this.board.getIntersectionDist(intersection);
    this.addStructure(rMap);
    this.victoryPoints += 2;
};

module.exports = Player;
