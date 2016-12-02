function determineColorsUsed(graph){
    var colors = [false, false, false, false, false]; //<= 5 colors always
    for(var i = 0; i < graph.numVertices; i++){
        var curV = graph.vertices[i];
        colors[curV.color - 1] = true;
    }

    var numUsed = 0;
    var numUsed = colors.reduce(function(count, cur){
            if(cur){
                return count + 1;
            } else{
                return count;
            }
        }, 0);
    console.log("Bonus " + (5 - numUsed));;
    return numUsed;
}

//Number of colors left are the bonus
function getBonus(graph){
    //var numColors = 5;
    return determineColorsUsed(graph);
}

// + 10*(level/10 + 1) for each color left after finishing the coloring
// Level number * 10 for clearing the level
function calculateScore(level, graph){
    var score = level*10;
    if(getBonus(graph)<=3)
    {
        score += 30;
    }
    
    return score;
}
