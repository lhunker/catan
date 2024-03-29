/**
 * Constructs a new tile
 * @param x coordinate
 * @param y coordinate
 * @param res resource contained in this square
 * @param roll Die roll needed to collect resource
 */
function Tile(x, y, res, roll) {
    this.x = x;
    this.y = y;
    this.resource = res;
    this.roll = roll;
}

Tile.prototype.toString = function() {
    var str = 'Coordinates: ' + this.x + ', ' + this.y + '\n';
    str += 'Resource: ' + this.resource + '\n';
    str += 'Roll: ' + this.roll + '\nIntersections:\n';
    for (var i = 0; i < 6; i++) {
        var isect = this.intersections[i];
        str += '    ' + i + ': ';
        if (isect.length === undefined)
            str += 'None';
        else {
            for (var j = 0; j < isect.length; j++) {
                if (j !== 0) str += ', ';
                str += '[x: ' + isect[j].x + ', y: ' + isect[j].y + ', point: ' + isect[j].hexPoint + ']';
            }
        }
        str += '\n';
    }
    return str;
};

/**
 * Get the indices of the tile for indexing
 * @returns {{x: *, y: *}}
 */
Tile.prototype.getIndices = function getIndices(){
    return {x: this.x, y: this.y};
};

/**
 * Returns a 1-2 letter resource code for the resource on this tile
 * @returns string the resource code
 */
Tile.prototype.getRCode = function(){
  if (this.resource === 'wood'){
      return 'w ';
  } else if (this.resource === 'straw'){
      return 'st';
  } else if (this.resource === 'sheep'){
      return 'sh';
  } else if (this.resource === 'brick'){
      return 'b ';
  } else if (this.resource === 'desert'){
      return 'd ';
  } else {
      return 'o ';
  }
};

module.exports = Tile;
