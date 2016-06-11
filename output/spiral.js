/// Based on code at http://bl.ocks.org/fabiovalse/dfcd8104a79aed092af1
///  Modified by Andrew Su on 2016-06-11 

var width = 1000,    // svg width
    height = 1000;   // svg height

var rotation = 2 * Math.PI;   // global variable

function calcCoords ( thisCenterX, thisCenterY, thisNumPoints, thisChord, thisAwayStep ) {
  
  var coords = [];    // output array
  var theta = thisChord / thisAwayStep;

  for ( i = 0; i < thisNumPoints; i++ ) {
      var away = thisAwayStep * theta;
      var around = theta + rotation;
    
      var x = thisCenterX + Math.cos ( around ) * away;
      var y = thisCenterY + Math.sin ( around ) * away;

      theta += thisChord / away;
    
      coords.push({x: x, y: y});
  }

  return coords;
}

var centerX = width/2,   // x coordinate of spiral center
    centerY = height/2,  // y coordinate of spiral center
    numPoints = 200,     // number of points in the spiral
    awayStep = 10,       // rate of increase of sprial radius
    chord = 30;          // spacing between points

var new_time = calcCoords( centerX, centerY, numPoints, chord, awayStep );

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("cardinal");

svg.append("path")
  .attr("d", lineFunction(new_time))
  .attr("stroke", "gray")
  .attr("stroke-width", 0.5)
  .attr("fill", "none");


var circles = svg.selectAll("circle")
                .data(new_time)
              .enter()
                .append("circle")
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("r", 5);