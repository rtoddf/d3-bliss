cmg.query(document).ready(function($){
	// GENERAL VARS
	var vis,
		legend,
		color = d3.scale.category20(),
		chart_type = "line";

	// we need to set default margins, but there need to be options in
	// the admin for a producer to overwrite in case there labels on 
	// any axis are longer then the defaults
	var margins = {top: 20, right: 20, bottom: 50, left: 50}

	// VARS FOR THIS CHART
	var container_parent = $('.article');
	var chart_container = $("#dataVizChart")
	var width = container_parent.width() - margins.left - margins.right;
	var height = (width * .66) - margins.top - margins.bottom;
	var aspect;
	var circle_radius = 3, 
		circle_color = 'rgba(0,0,0,.25)';

	var x_axis_sorter = 'Year',
		y_axis_label = 'Admissions vs Population';

	// SET X SCALE
	if (chart_type == "bar") {
		var x0 = d3.scale.ordinal()
			.rangeRoundBands([ 0, width ], .1)
		var x1 = d3.scale.ordinal()
	} else {
		var x = d3.scale.linear()
			.range([ 0, width ]);
	}

	// SET Y SCALE
	var y = d3.scale.linear()
		.range([ height, 0 ]);

	// SET UP THE X & Y AXIS
	if (chart_type == "bar") {
		var xAxis = d3.svg.axis()
			.scale(x0)
			.orient('bottom')

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickSize(-width)
			.tickFormat(d3.format(".2s"))
	} else {
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"))		
	}

	// LINE FUNCTION FOR LINE CHART - no if needed
	var line = d3.svg.line()
		.interpolate("linear")
		.x(function(d) {
			return x(d.name); 
		})
		.y(function(d) {
			return y(d.value);
		});		

	// CHART AND DATA SETUP
	function setupChart() {
		// all charts need this lines to convert to a json object
		var $ = cmg.query,
			data_list = cmg.display.data[0],
			data = [];

		for(var i in data_list) data.push(data_list[i]);

		// append the svg for drawing the chart
		vis = d3.select("#dataVizChart")
			.append("svg")
			.attr({
				"width": width + margins.left + margins.right,
				"height": height + margins.top + margins.bottom,
				"preserveAspectRatio": "xMinYMid",
				"viewBox": "0 0 " + (width + margins.left + margins.right) + " " + (height + margins.top + margins.bottom)
			})
			.append('g')
			.attr({
				'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
			})

		aspect = chart_container.width() / chart_container.height();

		// SET UP THE LEGEND
		legend = d3.select("#dataVizLegend")
			.append("div")
			.attr({
				"class": "legend",
			});

		drawChart(data);
	}

	function drawChart(data) {
		var x_sorter = d3.keys(data[0]).filter(function(key){
			return key !== x_axis_sorter
		})

		data.forEach(function(d){
			d.sorter = x_sorter.map(function(name){
				return {
					name: name,
					value: +d[name]
				}
			})
		})

		if (chart_type == "bar") {
		
		} else {
			x.domain(d3.extent(data, function(d) { 
				return d[x_axis_sorter]; 
			}));

			color.domain(d3.keys(data[0]).filter(function(key){
				return key !== x_axis_sorter;
			}))

			var data_sorted = color.domain().map(function(name){
				return {
					name: name,
					values: data.map(function(d){
						return {
							name: d[x_axis_sorter],
							value: +d[name]
						}
					})
				}
			})

			data_sorted.pop()
			data = data_sorted

			y.domain([ 0, d3.max(data, function(d){
				return d3.max(d.values, function(d){
					return d.value
				})
			})])
		}

		// DRAW THE X and Y AXES
		vis.append('g')
			.attr({
				'class': 'x axis',
				'transform': 'translate(0, ' + height + ')'
			})
			.call(xAxis)
			.selectAll("text")
	            .attr({
	            	"dx": "-.8em",
					"dy": ".15em",
					"transform": function(d) {
	                	return "rotate(-65)" 
	                }
	            })
	            .style({
	            	"text-anchor": "end"
	            });

		vis.append('g')
			.attr({
				'class': 'y axis',
				"transform": "translate(0, 0)"
			})
			.call(yAxis)
				.append('text')
					.attr({
						'transform': 'rotate(-90)',
						'x': 0,
						"dx": -(height / 2),
						"y": -(margins.left),
						"dy": ".71em"
					})
					.style({
						'text-anchor': 'middle'
					})
					.text(y_axis_label)

		// LINE CHART - DRAW LINES
		if (chart_type == "line") {
			var line_group = vis.selectAll(".line_group")
				.data(data)
					.enter().append("g")
				.attr({
					"class": "line_group"
				});

			line_group.append("path")
				.attr({
					"class": "line",
					"d": function(d) {
						console.log('d: ', d)
						return line(d.values);
					}
				})
				.style({
					"stroke": function(d) {
						return color(d.name);
					}
				});
		}	

		var circles = vis.selectAll('.circs')
				.data(data)
			.enter().append('g')
			.attr({
				'class': 'circ',
				'transform': 'translate(0, 0)'
			})

		circles.selectAll('circle')
				.data(function(d){
					return d.values
				})
			.enter().append('circle')
			.attr({
				'class': 'circle',
				'fill': circle_color,
				'cx': function(d) {
					return x(d.name)
				},
				'cy': function(d) {
					return y(d.value)
				},
				'r': circle_radius
			})

		drawLegend(data);
	}
	
	// DRAW THE LEGEND
	function drawLegend(data) {
		var result = legend.selectAll("div")
				.data(data)
			.enter().append("div")
				.attr({
					"class": "result"
				});

		result.append("span")
			.attr({
				"class": "color"
			})
			.style("background-color", function(d) {
				return color(d.name);
			})

		result.append("span")
			.text(function(d) {
				 return d.name;
			})
	}

	$(window).on("resize", function() {
	    var targetWidth = container_parent.width();
	    vis
		    .attr({
		    	'width': targetWidth,
		    	'height': Math.round(targetWidth / aspect)
		    })
	})

	$(function () {
		cmg.display.read_data(setupChart, null);
	});
});