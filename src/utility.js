var Tile = require('./tile.js');

// See https://i.imgur.com/Lj2sduV.jpg for basic coordinate system

// TODO use environment variable for inclusion of harbors
var boardWidth = 4;

// Max Y coordinate for a given X value
var columnHeights = {
    0: 3,
    1: 4,
    2: 5,
    3: 5,
    4: 5
};

function Utility() {
}

/**
 * Creates a complete board for Catan
 * @returns [] An array of tiles representing a whole board
 */
Utility.prototype.createBoard = function() {
    var tiles = this.createTiles();
    tiles = this.locateIntersections(tiles);
    return tiles;
};

/**
 * Creates a random distribution of tiles
 * @return [{x, y, resource, probability}, ...] list of tiles
 */
Utility.prototype.createTiles = function() {
    var resourceRemaining = [
        'forest', 'forest', 'forest', 'forest',
        'grain', 'grain', 'grain', 'grain',
        'sheep', 'sheep', 'sheep', 'sheep',
        'ore', 'ore', 'ore',
        'brick', 'brick', 'brick',
        'desert'
    ];

    var dieRemaining = [
        2,
        3, 3,
        4, 4,
        5, 5,
        6, 6,
        8, 8,
        9, 9,
        10, 10,
        11, 11,
        12
    ];

    var tiles = [];
    var row = 0, column = 0;
    for (var i = 0; i < 19; i++) {
        console.log(column + ', ' + row);
        var index = Math.floor(Math.random() * resourceRemaining.length);
        var resource = resourceRemaining.splice(index, 1);
        var roll = 0;
        // Get roll number for square, unless it is desert, which has no resources
        // and thus no roll number
        if (resource !== 'desert') {
            roll = dieRemaining.splice(index, 1);
        }
        tiles.push(new Tile(column, row, resource, roll));
        row++;
        if (row >= columnHeights[column]) {
            row = 0;
            if (column > 2) row = column - 2;
            column++;
        }
    }

    return tiles;
};

/**
 * Gets a list of intersection points for a given tile
 * This relies mainly on black magic (AKA math and my art skills)
 * @param tile containing an X and Y coordinate
 * @returns {hexPoint: [], ...} arrays of points identifying intersections
 *                              using hex points of the given tile as keys
 */
Utility.prototype.getIntersectionsForTile = function(tile) {
    var points = {};

    // Check for non-intersection edge points
    if (tile.y === 0 && tile.x <= 2) {
        points[0] = NaN;
    }

    // Since board is curved, this defines the right edge
    if (tile.x >= 2 && tile.x - tile.y === 2) {
        points[1] = NaN;
    }

    if (tile.x === 4) {
        points[2] = NaN;
    }

    if (tile.x >= 2 && tile.y === columnHeights[tile.x] - 1) {
        points[3] = NaN;
    }

    if (tile.x <= 2 && tile.y === columnHeights[tile.x] - 1) {
        points[4] = NaN;
    }

    if (tile.x === 0) {
        points[5] = NaN;
    }

    // For each possible point
    for (var i = 0; i < 6; i++) {
        // If already set as non-intersection, skip
        if (points.hasOwnProperty(i) && isNaN(points[i])) continue;
        points[i] = [];
        /* Coordinate black magic to calculate intersections
         * I drew a pretty picture to figure this out so you don't need to read the code
         * https://i.imgur.com/Lj2sduV.jpg
         *
         * Essentially each consecutive point shares a neighbor, so this adds
         * them in groups of two
         * The logic first determines which set of two neighboring points it falls into,
         * then checks the adjusted X and Y coordinates are actually on the board
         * The other tile's hex point is calculated using whatever math equation fit
         * the numbers, again, reference the drawing/a hexagonal board for verification
         */
         // Points 0, 1
        if (i < 2) {
            if (tile.y - 1 >= 0) {
                points[i].push({x: tile.x, y: tile.y - 1, hexPoint: 4 - i});
            }
        }

        // 1, 2
        if (0 < i && i < 3) {
            if (tile.x + 1 < boardWidth && tile.y < columnHeights[tile.x + 1]) {
                points[i].push({x: tile.x + 1, y: tile.y, hexPoint: 5 - (i - 1)});
            }
        }

        // 2, 3
        if (1 < i && i < 4) {
            if (tile.x + 1 < boardWidth && tile.y + 1 < columnHeights[tile.x + 1]) {
                points[i].push({x: tile.x + 1, y: tile.y + 1, hexPoint: (i - 2) * 5});
            }
        }

        // 3, 4
        if (2 < i && i < 5) {
            if (tile.y + 1 < columnHeights[tile.x]) {
                points[i].push({x: tile.x, y: tile.y + 1, hexPoint: 4 - i});
            }
        }

        // 4, 5
        if (i > 3) {
            if (tile.x - 1 >= 0 && tile.y < columnHeights[tile.x - 1]) {
                points[i].push({x: tile.x - 1, y: tile.y, hexPoint: ((i - 5) * -1) + 1});
            }
        }

        // 5, 0
        if (i % 5 === 0) {
            if (tile.x - 1 >= 0 && tile.y - 1 >= 0) {
                points[i].push({x: tile.x - 1, y: tile.y - 1, hexPoint: Math.abs(i - 2)});
            }
        }

        points[i] = this.sortPoints(points[i]);
    }
    return points;
};

Utility.prototype.sortPoints = function(points) {
    // TODO this
    return points;
};

/**
 * Finds intersections for every tile in tiles
 * @param tiles to find intersections of
 * @returns [] tiles with intersections
 */
Utility.prototype.locateIntersections = function(tiles) {
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        tile.intersections = this.getIntersectionsForTile(tile);
    }
    return tiles;
};

module.exports = Utility;
