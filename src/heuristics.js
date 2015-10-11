/**
 * Created by Daniel on 10/11/2015.
 */

/**
 * Counts adjacent resources to maximize number of resources acquired
 * @param intersection the intersection in question
 * @param board the board the intersection is on
 * @returns {Number} the number of materials in tiles adjacent to the intersection
 */
function h1MostResources(intersection, board){
    return board.getIntersectionDist(intersection).length;
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
    var score = 0;
    var intDist= board.getIntersectionDist(intersection);
    score += intDist.length;

    for (var i = 0; i < intDist.length; i++){
        score -= 0.25 * (resources[intDist[i]]);     // Let's check this
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
