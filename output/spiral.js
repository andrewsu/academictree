/// Based on code at http://bl.ocks.org/fabiovalse/dfcd8104a79aed092af1
///  Modified by Andrew Su on 2016-06-11 

var width = 1000,    // svg width
    height = 1000;   // svg height

var rotation = 2 * Math.PI;   // global variable

var spiralParams = {
  "level1": { 
    "opacity": 1,
    "r": 10,
    "chord": 30,
    "awayStep": 20 
  },
  "level2": { 
    "opacity": 1,
    "r": 10,
    "chord": 15,
    "awayStep": 10 
  },
  "level3": { 
    "opacity": .5,
    "r": 5,
    "chord": 10,
    "awayStep": 5 
  },
  "level4": { 
    "opacity": .3,
    "r": 3,
    "chord": 5,
    "awayStep": 5 
  },
  "level5": { 
    "opacity": .15,
    "r": 2,
    "chord": 5,
    "awayStep": 5 
  },
  "default": { 
    "opacity": .1,
    "r": 1,
    "chord": 3,
    "awayStep": 5 
  },
}

function calcCoords ( thisCenterX, thisCenterY, thisNumPoints, thisChord, thisAwayStep ) {
  
  var coords = [];    // output array
  var theta = thisChord / thisAwayStep;

//  coords.push({x: thisCenterX, y: thisCenterY, level:level})

//  console.log ("B: " + thisChord + ", " + thisAwayStep)

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

var lineFunction = d3.svg.line()
                      .x(function(d) { return d.x; })
                      .y(function(d) { return d.y; })
                      .interpolate("cardinal");

function plotSpiral ( root ) {

  if( root.children.length == 0 ) { return; }

  var tempArray = JSON.parse(JSON.stringify(root.children));   // so add parent coordinates to spiral
  tempArray.unshift(root);

  svg.append("path")
    .attr("d", lineFunction(tempArray))
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("fill", "none");

  var circles = svg.selectAll("svg")  // changed this selector to "svg" and it works, not sure why
                  .data(root.children)
                .enter()
                  .append("circle")
                  .attr("cx", function (d) { return d.x; })
                  .attr("cy", function (d) { return d.y; })
                  .attr("r", function (d) { 
                    var r; 
                    var level = "level".concat(d.level);
                    //console.log("D: ", d.level );
                    try{ r = spiralParams[level].r; }
                    catch (err) { r = spiralParams["default"].r; }
                    return r;
                  })
                  .style("opacity", function (d) {
                    var opacity;
                    var level = "level".concat(d.level);
                    try{ opacity = spiralParams[level].opacity }
                    catch (err) { opacity = spiralParams["default"].opacity }
                    console.log("O: " + level + "," + opacity);
                    return opacity;
                  })
                  .attr("class", function (d) { return "level".concat(d.level)});
;

  for( var i = 0; i < root.children.length; i++ ) {
    plotSpiral(root.children[i]);
  }

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

function addCoords( root, centerX, centerY ) {
  root.x = centerX;
  root.y = centerY;

  var level = "level".concat(root.level);
  var chord;
  var awayStep;
  try {
    chord = spiralParams[level].chord,        // spacing between points
    awayStep = spiralParams[level].awayStep;  // rate of increase of spiral radius
  }
  catch (err) {
    chord = spiralParams["default"].chord;
    awayStep = spiralParams["default"].awayStep;
  }

  console.log("PARAMS (" + level + "): " + chord + ", " + awayStep)

  var coords = calcCoords(centerX, centerY, root.children.length, chord, awayStep )

  for(var i = 0; i<root.children.length; i++ ) {
    root.children[i] = addCoords( root.children[i], coords[i].x, coords[i].y )
  }

  return(root)
}

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

var new_time;  // make this a global variable so I can inspect it

var centerX = width/2,   // x coordinate of spiral center
    centerY = height/2,  // y coordinate of spiral center
    chord = 30,          // spacing between points
    awayStep = 10;       // rate of increase of spiral radius

var z; 
d3.json("output_GW.json", function(error, root) {
  if (error) throw error;

  root = addCoords( root, centerX, centerY );
  plotSpiral( root );

  z = root;   /// temporary so I can inspect it
//  processPerson( root, centerX, centerY, root.level )
});


