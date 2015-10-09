/**
 * Created by lhunker on 10/6/15.
 * Class for a catan board
 */

var utility = require('./utility');

/**
 * Creates an empty board class
 * @constructor
 */
function Board(){
    this.tiles = [];
    this.structures = [];
    this.roads = [];
    this.dieProbabilities = {
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
    var _this = this;
    tiles.forEach(function (t){
        _this.tiles[JSON.stringify(t.getIndices())] = t;
    });
};

/**
 *  Add roads to the board
 * @param roads an array of road objects to add to the board
 *  format [intersection, intersection]   //TODO add utility function to make these
 *  Assumes a road is {int1, int2, player}
 */
Board.prototype.addRoads = function addRoads(roads){
    var _this = this;
    roads.forEach(function(r){
        //TODO change if roads become a class or have mre vars
       _this.roads[{int1: r.int1, int2: r.int2}] = r;
    });
};

/**
 * Adds structures to the board
 * @param structs An array of structures to add //TODO further define structures
 */
Board.prototype.addStructures = function addStructures(structs){
  var _this = this;
    structs.forEach(function(s){
        //TODO change once structure class is more defined
        _this.structures[s.intersection] = s;
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
 * @returns {*} The road, or undefined if no raod exists
 */
Board.prototype.roadAt = function roadAt(int1, int2){
    //TODO sort intersections
    return this.roads[{int1: int1, int2: int2}];
};

/**
 * Returns the structure at the intersection
 * @param intersection The intersection to look at. Assumes it has been generated in sorted order
 * @returns {*} The structure, or undefined if there is no structure at this location
 */
Board.prototype.structureAt = function structureAt(intersection){
    return this.structures[intersection];
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
 * Print the current board to terminal (or somewhere else if we have time)
 * Currently prints resources on each tile
 */
Board.prototype.printBoard = function(){
    for (var i = 0; i <= utility.xMax; i++){
        var outString = '';
        for (var j = 0; j <= utility.yMax; j++){
           var t = this.tileAt(i, j);
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

module.exports = Board;
