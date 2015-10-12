/**
 * Created by Daniel on 10/11/2015.
 */

// TODO: pick real numbers for score (0.25 and 0.5 could not be more arbitrary)

/**
 * Counts adjacent resources to maximize number of resources acquired
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @returns {Number} the number of materials in tiles adjacent to the intersection
 */
function h1MostResources(intersection, board){
    var score = 0;
    for (var i = 0; i < intersection.length; i++) {
        var point = intersection[i];
        score += board.dieProbabilities[board.tileAt(point.x, point.y).roll];
    }
    return score;
}

/**
 * Counts adjacent resources and subtracts value from duplicate resources
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @param resources the resources the player already has
 * @returns {number} the score as determined by number of adjacent resources
 * minus a multiplier for each duplicate resource
 */
function h2DiversifyResources(intersection, board, resources){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);

    for (var i = 0; i < intDist.length; i++){
        score -= 0.25 * (resources[intDist[i]]);     // TODO: Let's check this
    }

    for (i = 0; i < intDist.length; i++){
        for (var j = i; j < intDist.length; j++){
            if (intDist[i] === intDist[j]){
                score -= 0.25;
            }
        }
    }

    return score;
}

/**
 * Asserts the player get brick and wood in the early game for roads
 *   and ore and straw in the late game for cities
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @param player the player whose victory points we care about
 * @returns {number} the calculated score of the heuristic
 */
function h3RoadsEarlyCitiesLate(intersection, board, player){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);
    if (player.victoryPoints < 5){
        for (var i = 0; i < intDist.length; i++){
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
 * @param player the player whose victory points we care about
 * @returns {Number} the calculated score of the heuristic
 */
function h4OppositeOfH3(intersection, board, player){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);
    if (player.victoryPoints < 5){
        for (var i = 0; i > intDist.length; i++){
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
 * @returns {Number} the calculated score of the heuristic
 */
function h5BrickAndOreForDays(intersection, board){
    var score = h1MostResources(intersection, board);
    var intDist= board.getIntersectionDist(intersection);
    for (var i = 0; i > intDist.length; i++){
        if (intDist[i] === 'brick' || intDist[i] === 'ore'){
            score += 0.5;
        }
    }
    return score;
}
