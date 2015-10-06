/**
 * Created by lhunker on 10/6/15.
 * Class for a catan board
 */

/**
 * Creates an empty board class
 * @constructor
 */
function Board(){
    this.tiles = [];
    this.structures = [];
    this.roads = [];
}

/**
 * Add tiles to a board
 * @param tiles an array of tile objects to add to the board
 */
Board.prototype.addTiles = function addTiles(tiles){
    var _this = this;
    tiles.forEach(function (t){
        _this.tiles[t.getIndices()] = t;
    })
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
    return this.tiles[{x: x, y: y}];
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
 * Returns the struture at the intersection
 * @param intersection The intersection to look at. Assumes it has been generated in sorted order
 * @returns {*} The structure, or undefined if there is no structure at this location
 */
Board.prototype.structureAt = function structureAt(intersection){
    return this.structures[intersection];
};

module.exports = Board;
