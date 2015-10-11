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
    //TODO implement function
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
 * Determine the value to the player of a space
 * @param int the intersection in question
 */
function spaceValue(int){
    //TODO implement function
}

module.exports = Player;
