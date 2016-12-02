function Game() {
	this.graph = generateGraph(4);
	this.activeColor = 1;
	this.level = 1;
	this.time = 31000;
	this.paused = false;
	this.score = 0;
	//this.user = JSON.parse(localStorage.COLORSUser);

	console.log(this.graph.toString());
	console.log("it ui.js file");
	//console.log("Logged in as: " + this.user.name + ", id: " + this.user.id);
}

/* grey (default), red, blue, green, orange, purple */
var colors = ["#666666", "#FF6347", "#2ADCCB", "#9ACD32", "#FFA500", "#6A5ACD"];
var radius = 30;
var cRadius = 20;
var line = 4;
var timeInt;
var game = new Game();
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
$('#playerName').click(function(){
    $('#rulesModal').fadeOut('60');
    $('#stage').fadeOut('60');
    var modal = document.getElementById('myModal');
    modal.style.display="block";
    $('#playerName').fadeOut('60');
});
$('#clos').click(function(){
    $('#myModal').fadeOut('60');
    $('#rulesModal').fadeIn('60');
});
$('#submit').click(function(){
    $('#myModal').fadeOut('60');
    $('#rulesModal').fadeIn('60');
    var x = document.getElementById("myText").value;
    $('#player').html(x);
});
$('#startGame').click(function() {	//Game starts here after click start button
    $('#rulesModal').fadeOut(60);	//rules modal is disappearing slowly in 60 ml
    setTimeout(function() {			//every 60 ml sec ,renderFirstGraph call
    	renderFirstGraph(game.graph);	//draw vertex and edges btw vertex
    	timeInt = setInterval(function() {updateTime();}, 1000);	//every 1000 ml updateTime func call and time is updated and when time left 10 sec it print warning window..
    }, 60);
});

$('#playAgain').click(function() {
	$('#endGameModal').fadeOut('60');
	pastIndex=-1;
	setTimeout(function() {
		game = new Game();
		renderFirstGraph(game.graph);
		timeInt = setInterval(function() {updateTime();}, 1000);
		$('#scoreTracker').html('Score: ' + game.score);
	}, 100);
})

function circle(ctx, cx, cy, radius) {
	ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
   // ctx.closePath();
}

function roundedRect(ctx, x, y, height, radius){
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI, true);
	ctx.lineTo(x - radius, y + height - radius);
	ctx.arc(x, y + height - radius, radius, Math.PI, 2*Math.PI, true);
	ctx.closePath();
	ctx.fill();
}

function displayUserDetails() {
	// $("#header #user #name").text(game.user.name);
	//$("#header #user img").attr("src", game.user.profPic);
}

/* G: Graph */
function renderFirstGraph(G) {
	ctx.clearRect(0, 0, 700, 700);

	//generate array of "random" locations
	var locs = setLocs(G.numVertices);

	//set vertices at locations
	for(var i = 0; i < G.numVertices; i++) {
		G.vertices[i].loc.x = locs[i].x;
		G.vertices[i].loc.y = locs[i].y;
	}

	//draw graph edges
	for(var i = 0; i < G.numVertices; i++) {
		ctx.lineWidth = line;
		ctx.strokeStyle = "#fff";

		var currVertex = G.vertices[i];
		var numNeighbors = currVertex.neighbors.length;
		var p1 = currVertex.loc;

		for(var j = 0; j < numNeighbors; j++) {
			var p2 = G.vertices[currVertex.neighbors[j]].loc;
			if(p2) {
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.closePath();
				ctx.stroke();
			}
			else {
				console.log('empty neighbor');
			}
		}
	}

	updateColorDisplay(G);
	colorControls();
}

function colorControls() {
	ctx.clearRect(640, 200, 100, 450);

	for(var i = 1; i < colors.length; i++) {
		ctx.fillStyle = colors[colors.length - i];
		circle(ctx, 670 , 240 +60*i, cRadius);
		ctx.fill();

		/* active color state */
		if(game.activeColor == colors.length - i) {
			roundedRect(ctx, 670 , 240 + 60*i, 2*cRadius, cRadius);
			console.log('active');
		}

	}
}

/* G: Graph */
function updateColorDisplay(G) {

	for(var i = 0; i < G.numVertices; i++) {
		var V = G.vertices[i];
		if(V) {
			ctx.fillStyle = colors[V.color];
			var cx = V.loc.x;
			var cy = V.loc.y;
			circle(ctx, cx, cy, radius);
			//ctx.fillStyle='#666';
			ctx.fill();
			/*ctx.lineWidth=5;
			ctx.strokeStyle='#666';
			ctx.stroke();
			ctx.fillStyle='#000';
			ctx.font = ' 30pt Calibri'
			ctx.fillText(i+1,cx-10,cy+4);*/
			
			//ctx.fill(); 	
		}
		else {
			console.log('invalid vertex');
		}
	}
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
/* i: number of vertices, returns: array of points */
/* min radius: 100, max radius: 300 */
function setLocs(i) {
	var locArray = new Array();

	//divide circle into i segments
	var deg = 2*Math.PI / i;
	var temp = deg;
	/*var coordx[] = new Array();
	var coordy[] = new Array();*/
	var temp = new Array();
	for(var j = 0; j < i; j++) {

		var angle = j*deg;
		var rad = Math.floor(Math.random()* 140) + 140;
		//console.log("rad"+rad);

		/* use trig to find position from (350, 350) */
		var changeX = rad * Math.cos(angle);
		var changeY = rad * Math.sin(angle);

		/* Add new point to array with offset from center */
		locArray[j] = new Point(300 + changeX, 350 + changeY);
	}
	console.log(locArray);
	locArray = shuffle(locArray);
	console.log("After shuffle\t"+locArray);
	return locArray;
}

/* MOUSE EVENT */
function onMouseDown(event) {
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    console.log("mouse clicked coord\t"+x+"\t"+y);
    /* Check if Toggle Color Controls */
    for(var i = 1; i < colors.length; i++) {
    	if(inCircle(x, y, 670, 240+60*i, cRadius)) {
			game.activeColor = colors.length - i;
			console.log(game.activeColor);

			colorControls();
			break;
    	}
    }

    /* Check if Changing Point Color */
    console.log(game.graph);
    for(var i = 0; i < game.graph.numVertices; i++) {
    	var V = game.graph.vertices[i];

    	if(inCircle(x, y, V.loc.x, V.loc.y, radius)) {

    		/* valid color placement */
    		/*if((pastIndex == -1 && i== 0)||i == pastIndex+1)
    		{*/
	    		if(updateColor(game.graph, i, game.activeColor)) {
	    			updateColorDisplay(game.graph);
	    			pastIndex=i;
		    		if(allColored(game.graph)) {
		    			console.log('all colored');

		    			if(verifyColoring(game.graph)) {
		    				winGame();
		    			}
		    		}

		    		break;
	    		}
	    		/* invalid */
	    		/*else {
    			//$('#invalidColorModal').fadeIn(60);
    			setTimeout(function() {
					//$('#invalidColorModal').fadeOut(100);
					//game.score -= 10;
					$('#scoreTracker').html('Score: ' + game.score);
				}, 1000);*/
	    	//}
	    	/* invalid */
	    	/*else {
    			$('#invalidIndex').fadeIn(60);
    			setTimeout(function() {
					$('#invalidIndex').fadeOut(100);
					//game.time -= 3000;
					$('#scoreTracker').html('Score: ' + game.score);
				}, 1000);
    		}*/
    		$('#invalidColorModal').fadeIn(60);
    			setTimeout(function() {
					$('#invalidColorModal').fadeOut(100);
					//game.score -= 10;
					$('#scoreTracker').html('Score: ' + game.score);
				}, 1000);
    		
    		
    	}
    }
}
canvas.addEventListener('mousedown', onMouseDown, false);

$('#pauseModal').click(function() {
	timeInt = window.setInterval(function() {updateTime();}, 1000);
	game.paused = false;
	$('#pauseModal').fadeOut(60);
})

/* KEYBOARD EVENTS */
/* Z:1, X:2, C:3, V:4, B:5 */
function onKeyDown(event) {
    if (event.keyCode === 90) /* Z:1 */ {
        game.activeColor = 1;
		console.log(game.activeColor);

		colorControls();
    }
    else if (event.keyCode === 88) /* X:2 */ {
        game.activeColor = 2;
		console.log(game.activeColor);

		colorControls();
    }
    else if (event.keyCode === 67) /* C:3 */ {
        game.activeColor = 3;
		console.log(game.activeColor);

		colorControls();
    }
    else if (event.keyCode === 86) /* V:4 */ {
        game.activeColor = 4;
		console.log(game.activeColor);

		colorControls();
    }
    else if (event.keyCode === 66) /* B:5 */ {
        game.activeColor = 5;
		console.log(game.activeColor);

		colorControls();
    }

    else if (event.keyCode === 80) /* P:pause */ {
    	console.log("time: " + game.time);

    	if(game.paused) {
    		timeInt = window.setInterval(function() {updateTime();}, 1000);
    		game.paused = false;
    		$('#pauseModal').fadeOut(60);
    	}
    	else {
    		window.clearInterval(timeInt);
    		game.paused = true;
    		$('#pauseModal').fadeIn(60);
    	}
    }

    else if (event.keyCode > 48 && event.keyCode < 58) /* Number Keys */ {
    	game.time = 45000;
    	game.level = event.keyCode - 48;
    	game.graph = generateGraph(game.level + 4);
		renderFirstGraph(game.graph);
    	console.log(game.graph.toString());
    }
    else if(event.keyCode==83)
    {
    	$('#myModal').fadeOut('60');
    $('#rulesModal').fadeIn('60');
    var x = document.getElementById("myText").value;
    $('#player').html(x);
    }
}
window.addEventListener('keydown', onKeyDown, false);

/* x1, y1 testing point, x2, y2 center circle, r radius */
function inCircle(x1, y1, x2, y2, r) {
	var square_dist = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
    return (square_dist <= Math.pow(r, 2));
}

function updateTime() {
	game.time -= 1000;
	/*if(game.time < 10000) {
		$('#timer').html(game.time / 1000);
	}
*/	
	$('#timer').html(game.time / 1000);
	if(game.time <= 0) {
		$('#timer').html('');
		window.clearInterval(timeInt);
		gameOver();
	}
}

function winGame() {
	game.score += calculateScore(game.level, game.graph);
	game.level ++;
	game.time=31000+game.level*5000;
	//pastIndex=-1;
  var star = $('.fontawesome-star').first();
  var numStars = 5;
  //reset all the stars to not active
  for(var i = 0; i < numStars; i++, star = star.next().first()){
      star.removeClass('active');
  }

	var activeStars = getBonus(game.graph);
	console.log(activeStars);

	star = $('.fontawesome-star').first();
	for(var i = 0; i < activeStars; i++) {
		console.log(star);
		star.addClass('active');
		star = star.next().first();
	}

	$('#nextLevelModal').find('h1').html('Level ' + game.level);
	$('#nextLevelModal').find('h2').html('Your score is ' + game.score + ' points');
	$('#nextLevelModal').fadeIn(60);
    $('#timer').html('');

	setTimeout(function() {
		$('#scoreTracker').html('Score: ' + game.score);
		$('#nextLevelModal').fadeOut(60);
		game.graph = generateGraph(3 + game.level);
		renderFirstGraph(game.graph);
	}, 1000);
}

function gameOver() {
	$('#endGameModal').find('h2').html('Your score is ' + game.score + ' points');
	$('#endGameModal').fadeIn(60);
}
