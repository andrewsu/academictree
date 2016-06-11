var width = 960,
    height = 500;

var centerX = width/2,
    centerY = height/2,
    radius = 150,
    coils = 8;

var rotation = 2 * Math.PI;
var thetaMax = coils * 2 * Math.PI;
var awayStep = radius / thetaMax;
var chord = 20;

var new_time = [];

for ( theta = chord / awayStep; theta <= thetaMax; ) {
    away = awayStep * theta;
    around = theta + rotation;
  
    x = centerX + Math.cos ( around ) * away;
    y = centerY + Math.sin ( around ) * away;

    theta += chord / away;
  
    new_time.push({x: x, y: y});
}

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
                .attr("r", 2);