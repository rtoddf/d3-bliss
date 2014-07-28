var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 40, right: 40, bottom: 40, left: 40},
	width = container_parent.width(),
	height = (width * .7),
	vis, vis_group, aspect

var data = []
for (i=0; i < 1000; i++) {
    data.push({"x": Math.random(), "y": Math.random()})
}

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})

var defs = vis
	.append('defs')

vis_group = vis.append('g')

var x = d3.scale.linear()
		.domain([0,1])
		.range([width / 2 - 400,width / 2 + 400]),
	y = d3.scale.linear()
		.domain([0,1])
		.range([0,height]),
	r = d3.scale.linear()
		.domain([0,1])
		.range([5,10]),
	c = d3.scale.linear()
		.domain([0,1])
		.range(["hsl(250, 50%, 50%)", "hsl(350, 100%, 50%)"])
		.interpolate(d3.interpolateHsl)
 
vis_group.selectAll("circle")
    .data(data)
    .enter().append("svg:circle")
    .attr("cx", function(d) { return x(d.x) })
    .attr("cy", function(d) { return y(d.y) })
    .attr("stroke-width", "none")
    .attr("fill", function() { return c(Math.random()) })
    .attr("fill-opacity", .5)
    .attr("visibility", "hidden")
    .attr("r", function() { return r(Math.random()) })
    .on("mouseover", function() {
        d3.select(this).transition()
        .attr("cy", function() { return y2(Math.random()) })
        .delay(0)
        .duration(2000)
        .ease("elastic", 10, .3)
    })

var y2 = d3.scale.linear()
	.domain([0,1])
	.range([height/2 - 20, height/2 + 20])
var del = d3.scale.linear().domain([0,1]).range([0,1])
 
d3.selectAll("circle").transition()
    .attr("cx", function() { return x(Math.random()) })
    .attr("cy", function() { return y2(Math.random()) })
    .attr("visibility", "visible")
    .delay(function(d,i) { return i * del(Math.random()) })
    .duration(1000)
    .ease("elastic", 10, .45)