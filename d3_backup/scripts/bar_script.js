cmg.query(document).ready(function($){

	// VARS FOR THIS CHART
	var chart_type = "bar";
	var container_parent = $('.article');
	var chart_container = $("#dataVizChart")
	var width = container_parent.width();
	var height = width / 2;
	var aspect;

	if (chart_type == "bar") {
		var x_axis_column = "Category",
			y_axis_columns = [ "FY2012" ];
	} else {
		var x_axis_column = "Year",
			y_axis_columns = ["Expense: Parks & Recreation", "Expense: Public Safety", "Expense: Public Works", "Expense: Social Services", "Revenue: Personal Property: Inc. Businesses", "Revenue: Personal Property: Uninc. Businesses"];
	}

	var y_label = "Revenue in Millions of Dollars";

	// GENERAL VARS
	var margins = {top: 20, right: 50, bottom: 20, left: 60},
		vis,
		legend,
		color = d3.scale.category20c();

	// HELPER FUNCTIONS
	var parseDate = d3.time.format("%Y").parse;
	var isDateObject = function(date){
		return typeof(date) === "string" && date === null ? date : "" + date;
	}

	// SET X SCALE
	if (chart_type == "bar") {
		var x = d3.scale.ordinal()
			.rangeBands([ margins.left, width ]);
	} else {
		var x = d3.time.scale()
			.range([ margins.left, width ]);
	}

	// SET Y SCALE
	var y = d3.scale.linear()
		.range([ height, 0 ]);

	// SET UP THE Y AXIS
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickSize(-(width - margins.left))
		.tickFormat(d3.format(".2s"));

	// LINE FUNCTION FOR LINE CHART - no if needed
	var line = d3.svg.line()
		.interpolate("linear")
		.x(function(d) {
			return x(d.date); 
		})
		.y(function(d) {
			return y(d.value);
		});

	// CHART AND DATA SETUP
	function setupChart() {
		var $ = cmg.query,
			data_list = cmg.display.data[0],
			data = [];

		if (chart_type == "bar") {
			for (i in data_list) {
				var obj = {
					category: data_list[i][x_axis_column],
					price: cmg.display.parse_float_liberally(data_list[i][y_axis_columns])
				}
				data.push(obj);
			}
		} else {
			for(var i in data_list) data.push(data_list[i]);
		}

		// SET UP THE SVG FOR THE CHART
		vis = d3.select("#dataVizChart")
			.append("svg")
			.attr({
				"width": width + margins.left + margins.right,
				"height": height + margins.top + margins.bottom,
				"preserveAspectRatio": "xMinYMid",
				"viewBox": "0 0 " + width + " " + height,
				"transform": "translate(" + margins.left + "," + margins.top + ")"
			})

		aspect = chart_container.width() / chart_container.height();

		// SET UP THE LEGEND
		legend = d3.select("#dataVizLegend")
			.append("div")
			.attr({
				"class": "legend",
			});

		drawBarChart(data);
	}

	function drawBarChart(data) {
		// SET THE X AXES
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(data.length);

		// SET THE X AXIS VALUES IN INTEGERS
		if (chart_type == "bar") {
			data.forEach(function(d) {
				d[x_axis_column] = +d[x_axis_column];
			});
		} else {
			data.forEach(function(d) {
				d[x_axis_column] = parseDate(isDateObject(d[x_axis_column]));
			});
		}

		// SET DOMAINS
		if (chart_type == "bar") {
			x.domain(d3.range(data.length));
			y.domain([ 0, d3.max(data, function(d){ 
				return d.price
			}) ]);
		} else {
			color.domain(d3.keys(data[0]).filter(function(key){
				return key !== x_axis_column;
			}))

			x.domain(d3.extent(data, function(d) { 
				return d[x_axis_column]; 
			}));

			var data_sorted = color.domain().map(function(name){
				return {
					name: name,
					values: data.map(function(d){
						return {
							date: d[x_axis_column],
							value: + d[name]
						}
					})
				}
			})

			data = data_sorted;

			y.domain([
				d3.min(data, function(c) {
					return d3.min(c.values, function(v) {
						return v.value;
					});
				}),
				d3.max(data, function(c) {
					return d3.max(c.values, function(v) {
						return v.value;
					});
				})
			]);
		}

		// DRAW THE X and Y AXES
		vis.append("g")
			.attr({
				"class": "x axis",
				"transform": "translate(0," + height + ")"
			})
			.call(xAxis)
				.append("text")
					.attr({
						"x": margins.left,
						"dx": width / 2,
						"y": function(){
							return (chart_type == "bar") ? margins.bottom : margins.bottom + 15;
						}
					})
					.style({
						"text-anchor": "end"
					})
					.text(x_axis_column);

		vis.append("g")
			.attr({
				"class": "y axis",
				"transform": "translate(" + margins.left + ", 0)"
			})
			.call(yAxis)
				.append("text")
					.attr({
						"transform": "rotate(-90)",
						"x": 0,
						"dx": -(height / 2),
						"y": -(margins.left),
						"dy": ".71em"
					})
					.style({
						"text-anchor": "middle"
					})
					.text(y_label);

		// BAR CHART - DRAW RECTS
		if (chart_type == "bar") {
			var bars = vis.selectAll("rect")
				.data(data).enter()
					.append("rect")
					.attr({
						"x": function(d, i) {
							return x(i) + 3;
						},
						"y": function(d) {
							return y(d.price);
						},
						"width": function(d) {
							return (width - margins.left - margins.right) / data.length;
						},
						"height": function(d) {
							return height - y(d.price);
						}
					})
					.style("fill", function(d) {
						return color(d.price);
					})
		}

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
						return line(d.values);
					}
				})
				.style({
					"stroke": function(d) {
						return color(d.name);
					}
				});
		}

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
				return (chart_type == "bar") ? color(d.price) : color(d.name);
			})

		result.append("span")
			.text(function(d) {
				 return (chart_type == "bar") ? d.category : d.name;
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