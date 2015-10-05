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

module.exports = Tile;
