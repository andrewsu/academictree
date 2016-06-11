/// Based on code at http://bl.ocks.org/fabiovalse/dfcd8104a79aed092af1
///  Modified by Andrew Su on 2016-06-11 

var width = 1000,    // svg width
    height = 1000;   // svg height

var rotation = 2 * Math.PI;   // global variable

function calcCoords ( thisCenterX, thisCenterY, thisNumPoints, thisChord, thisAwayStep, level ) {
  
  var coords = [];    // output array
  var theta = thisChord / thisAwayStep;

  coords.push({x: thisCenterX, y: thisCenterY, level:level})

  for ( i = 0; i < thisNumPoints - 1; i++ ) {
      var away = thisAwayStep * theta;
      var around = theta + rotation;
    
      var x = thisCenterX + Math.cos ( around ) * away;
      var y = thisCenterY + Math.sin ( around ) * away;

      theta += thisChord / away;
    
      coords.push({x: x, y: y, level: level});
  }

  return coords;
}

function makeSpiral ( thisCenterX, thisCenterY, thisNumPoints, thisChord, thisAwayStep, level) {

  new_time = calcCoords( thisCenterX, thisCenterY, thisNumPoints, thisChord, thisAwayStep, level );

  var lineFunction = d3.svg.line()
                      .x(function(d) { return d.x; })
                      .y(function(d) { return d.y; })
                      .interpolate("cardinal");

  svg.append("path")
    .attr("d", lineFunction(new_time))
    .attr("stroke", "gray")
    .attr("stroke-width", 0.5)
    .attr("fill", "none");


  var circles = svg.selectAll("svg")  // changed this selector to "svg" and it works, not sure why
                  .data(new_time)
                .enter()
                  .append("circle")
                  .attr("cx", function (d) { return d.x; })
                  .attr("cy", function (d) { return d.y; })
                  .attr("r", 5)
                  .attr("class", function(d){ return "level".concat(d.level)});

  return(new_time);

}


//makeSpiral ( centerX, centerY, numPoints, chord, awayStep );

//makeSpiral ( new_time[199].x, new_time[199].y, 21, 10, 3 );

function processPerson ( root, centerX, centerY, level ) {

  console.log( "Processing " + root.name );

  if( root.children.length == 0 ) { console.log("No children"); return; }

  var coords = makeSpiral(centerX, centerY, root.children.length+1, chord, awayStep, level)
  console.log( "COORDS.length: " + coords.length )
  console.log( "CHILDREN.length: " + root.children.length )

  for(var i=0; i<root.children.length; i++) {
    console.log("CHILD: " + root.children[i].name)
    processPerson( root.children[i], coords[i+1].x, coords[i+1].y, level+1)
  }
}

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var new_time;  // make this a global variable so I can inspect it

var centerX = width/2,   // x coordinate of spiral center
    centerY = height/2,  // y coordinate of spiral center
    numPoints = 200,     // number of points in the spiral
    chord = 30,          // spacing between points
    awayStep = 10;       // rate of increase of sprial radius

var z; 
d3.json("output.json", function(error, root) {
  if (error) throw error;

  z = root;   /// temporary so I can inspect it
  console.log("ROOT: " + root);
  processPerson( root, centerX, centerY, root.level )
});


