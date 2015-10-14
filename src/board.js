/**
 * Created by lhunker on 10/6/15.
 * Class for a catan board
 */

var utility = require('./utility');
var _ = require('underscore');

/**
 * Creates an empty board class
 * @constructor
 */
function Board(){
    this.tiles = {};
    this.structures = {};
    this.roads = [];
    this.intersections = [];        //TODO fill this in
    this.dieProbabilities = {   //TODO move this to utility
        2: 1/36,
        3: 1/18,
        4: 1/12,
        5: 1/9,
        6: 5/36,
        7: 1/6,
        8: 5/36,
        9: 1/9,
        10: 1/12,
        11: 1/18,
        12: 1/36
    };
}

/**
 * Add tiles to a board
 * @param tiles an array of tile objects to add to the board
 */
Board.prototype.addTiles = function addTiles(tiles){
    tiles = _.toArray(tiles);
    var _this = this;
    tiles.forEach(function (t){
        _this.tiles[JSON.stringify(t.getIndices())] = t;
    });
    this.intersections = utility.getUniqueIntersections(tiles);
};

/**
 *  Add roads to the board
 * @param roads an array of road objects to add to the board
 *  format [intersection, intersection]
 *  Assumes a road is {int1, int2, player}
 */
Board.prototype.addRoads = function addRoads(roads){
    var _this = this;
    roads.forEach(function(r){
        //TODO change if roads become a class or have mre vars
        _this.roads[JSON.stringify({int1: r.int1, int2: r.int2})] = r;
    });
};

/**
 * Adds structures to the board
 * @param structs An array of structures to add made from the functions in utility
 */
Board.prototype.addStructures = function addStructures(structs){
    var _this = this;
    structs.forEach(function(s){
        //console.info(JSON.stringify(s.int));
        _this.structures[JSON.stringify(s.int)] = s;
    });
};

/**
 * Returns the tile at X,Y
 * @param x the x coordinate
 * @param y the y coordinate
 * @returns {*} The tile object at x,y undefined if one doesn't exist
 */
Board.prototype.tileAt = function tileAt(x, y){
    return this.tiles[JSON.stringify({x: x, y: y})];
};

/**
 * Returns the road between int1 and int2
 * @param int1 the first intersection
 * @param int2 the second intersection
 * @returns {*} The road, or undefined if no road exists
 */
Board.prototype.roadAt = function roadAt(int1, int2){
    //TODO sort intersections
    return this.roads[JSON.stringify({int1: int1, int2: int2})];
};

/**
 * Returns the structure at the intersection
 * @param intersection The intersection to look at. Assumes it has been generated in sorted order
 * @returns {*} The structure, or undefined if there is no structure at this location
 */
Board.prototype.structureAt = function structureAt(intersection){
    return this.structures[JSON.stringify(intersection)];
};

/**
 * Calculates the score of an intersection, AKA value of putting a settlement there
 * @param intersection to get the value of
 * @returns number a numeric score, higher is better
 */
Board.prototype.getIntersectionScore = function(intersection) {
    // TODO currently returns sum of probabilities of a neighboring tile being selected
    //      for resource gathering
    var score = 0;
    for (var i = 0; i < intersection.length; i++) {
        var point = intersection[i];
        var tile = this.tileAt(point.x, point.y);
        score += getResourceValue(tile.resource);
    }
    return score;
};

/**
 * Gets the resources obtained by putting a structure at the settlement
 * @param int The intersection to check
 * @returns {{sheep: number, ore: number, wood: number, brick: number, straw: number}}
 *      the resources obtained from the intersection
 */
Board.prototype.getResources = function (int){
    var resources =  {sheep:0, ore: 0, wood: 0, brick: 0, straw: 0};

    for(var i = 0; i < int.length; i++){
        var tile = this.tileAt(int[i].x, int[i].y);
        var resource = tile.resource;
        if (resource === 'forest'){
            resources.wood += 1;
        } else if (resource === 'grain'){
            resources.straw += 1;
        } else if (resource === 'sheep'){
            resources.sheep += 1;
        } else if (resource === 'brick'){
            resources.brick += 1;
        } else {
            resources.ore += 1;
        }
    }

    return resources;
};

/**
 * Gets the what is earned at each roll for a given intersection
 * @param int the intersection to check
 * @returns {Array} an array or roll resource pairs
 */
Board.prototype.getIntersectionDist = function(int){
    var resources = [];

    for(var i = 0; i < int.length; i++){
        var tile = this.tileAt(int[i].x, int[i].y);
        var resource = tile.resource;
        var roll = {roll: tile.roll};
        if (resource === 'forest'){
            roll.resource = 'wood';
        } else if (resource === 'grain'){
            roll.resource = 'straw';
        } else if (resource === 'sheep'){
            roll.resource = 'sheep';
        } else if (resource === 'brick'){
            roll.resource = 'brick';
        } else {
            roll.resource = 'ore';
        }
        resources.push(roll);
    }

    return resources;
};

/**
 * Print the current board to terminal (or somewhere else if we have time)
 * Currently prints resources on each tile
 */
Board.prototype.printBoard = function(){

    for (var i = 0; i <= utility.xMax; i++){
        var outString = '';
        for (var j = 0; j <= utility.yMax; j++){
            var t = this.tileAt(j, i);
            if (t){
                outString += t.getRCode() + '  ';  //TODO better print function
            } else{
                outString = '  ' + outString;
            }
        }
        console.log(outString);
    }
};

/**
 * Returns the value of a resource, can reference game state and current
 * player conditions
 * @param tile Tile containing resource to get score of
 * @returns number current value of resource, higher is better
 */
function getResourceValue(tile) {
    // TODO use real values, consider game state and player resources and such
    if (tile.resource === 'desert') return 0;
    // TODO currently returns probability tile being rolled
    return this.dieProbabilities[tile.roll];
}

/**
 * Returns neighboring intersections for the given one
 * @param intersection to get neighbors of
 * @returns [] Array of neighboring intersections
 */
Board.prototype.getNeighborIntersections = function(intersection) {
    var neighbors = [];
    // For each intersection on the board
    for (var i = 0; i < this.intersections.length; i++) {
        // Don't want to match this intersection
        if (utility.intersectionsEqual(intersection, this.intersections[i])) continue;
        var matchCount = 0;
        // Consider each X/Y coordinate pairing in specified intersection and board intersection
        for (var j = 0; j < intersection.length; j++) {
            for (var k = 0; k < this.intersections[i].length; k++) {
                if (intersection[j].x === this.intersections[k].x && intersection[j].y === this.intersections[k].y)
                    matchCount++;
            }
        }
        // Should share all neighbors except one to be a neighbor
        if (matchCount === (intersection.length - 1))
            neighbors.push(this.intersections[i]);
    }
    return neighbors;
};

/**
 * @param intersection
 * @returns boolean true if can build here
 */
Board.prototype.isIntersectionBuildable = function(intersection) {
    if (this.structureAt(intersection)) return false;
    var neighbors = this.getNeighborIntersections(intersection);
    for (var i = 0; i < neighbors.length; i++)
        if (this.structureAt(neighbors[i])) return false;
    return true;
};

module.exports = Board;
