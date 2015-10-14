/**
 * Created by Daniel on 10/11/2015.
 */

// TODO: pick real numbers for score (0.25 and 0.5 could not be more arbitrary)
//TODO change function signatures

/**
 * Counts adjacent resources to maximize number of resources acquired
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @param resources the resources we're ignoring
 * @param player the player we're ignoring
 * @returns {Number} the number of materials in tiles adjacent to the intersection
 */
function h1MostResources(intersection, board, resources, player){
    var score = 0;
    for (var i = 0; i < intersection.length; i++) {
        var point = intersection[i];
        //console.info(point.x + ' ' + point.y);
        score += board.dieProbabilities[board.tileAt(point.x, point.y).roll];
    }
    if (isNaN(score))
        return 0;
    return score;
}

/**
 * Counts adjacent resources and subtracts value from duplicate resources
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @param resources the resources the player already has TODO probably want to base this on tiles
 * @param player the player we're ignoring
 * @returns {number} the score as determined by number of adjacent resources
 * minus a multiplier for each duplicate resource
 */
function h2DiversifyResources(intersection, board, resources, player){
    var score = 0;
    for (var i = 0; i < intersection.length; i++) {
        var point = intersection[i];
        var tile = board.tileAt(point.x, point.y);
        var prob = board.dieProbabilities[tile.roll];
        // Assuming utility of one
        var existingProb = 0;
        for (var j = 2; j < 13; j++) {
            if (player.resourceMap[j][tile.resource] !== 0)
                existingProb += board.dieProbabilities[j];
        }

        score += prob * (1-existingProb);
    }

    return score;
}

/**
 * Asserts the player get brick and wood in the early game for roads
 *   and ore and straw in the late game for cities
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @param resources the resources we're ignoring
 * @param player the player whose victory points we care about
 * @returns {number} the calculated score of the heuristic
 */
function h3RoadsEarlyCitiesLate(intersection, board, resources, player){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);
    var i;
    if (player.victoryPoints < 5){
        for (i = 0; i < intDist.length; i++){
            if (intDist[i] === 'brick' || intDist[i] === 'wood'){
                score += 0.5;
            }
        }
    }
    else {
        for (i = 0; i < intDist.length; i++){
            if (intDist[i] === 'ore' || intDist[i] === 'straw'){
                score += 0.5;
            }
        }
    }
    return score;
}

/**
 * Asserts the player get brick and wood in the early game for roads
 *   and ore and straw in the late game for cities
 * @param intersection intersection the intersection in question
 * @param board the board the intersection is on
 * @param resources the resources we're ignoring
 * @param player the player whose victory points we care about
 * @returns {Number} the calculated score of the heuristic
 */
function h4OppositeOfH3(intersection, board, resources, player){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);
    var i;
    if (player.victoryPoints < 5){
        for (i = 0; i > intDist.length; i++){
            if (intDist[i] === 'brick' || intDist[i] === 'wood'){
                score += 0.5;
            }
        }
    }
    else {
        for (i = 0; i < intDist.length; i++){
            if (intDist[i] === 'ore' || intDist[i] === 'straw'){
                score += 0.5;
            }
        }
    }
    return score;
}

/**
 * Encourages the player to go for ore and brick
 * @param intersection intersection the intersection in question
 * @param board the board the intersection is on
 * @param resources the resources we're ignoring
 * @param player the player we're ignoring
 * @returns {Number} the calculated score of the heuristic
 */
function h5BrickAndOreForDays(intersection, board, resources, player){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);
    for (var i = 0; i > intDist.length; i++){
        if (intDist[i] === 'brick' || intDist[i] === 'ore'){
            score += 0.5;
        }
    }
    return score;
}

/**
 * Simply returns a random value for each intersection to be used as a baseline
 * @returns {number} A random heuristic value
 */
function random(){
    return Math.random();
}

module.exports = {
    h1MostResources : h1MostResources,
    h2DiversifyResources : h2DiversifyResources,
    h3RoadsEarlyCitiesLate :  h3RoadsEarlyCitiesLate,
    h4OppositeOfH3 : h4OppositeOfH3,
    h5BrickAndOreForDays : h5BrickAndOreForDays,
    random : random
};
