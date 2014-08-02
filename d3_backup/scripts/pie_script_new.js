// genereal vars
var vis,
	legend,
	color = d3.scale.category20();

// browser vars
var margins = {top: 20, right: 20, bottom: 30, left: 50},
	width = 960,
	height = 500;

// vars for THIS chart
var chart_type = "pie",
	x_axis_column = "Category",
	y_axis_columns = ["FY2012"],
	out_opacity = 1,
	over_opacity = .7,
	color_legend_text = "#333"

// helper functions

// pie chart specfic vars
var radius = Math.min(width, height) / 2,
	arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(50);

// chart  and data set up
function setupChart() {
	var $ = cmg.query;
	var data_list = cmg.display.data[0];
	var data;

	console.log('data_list: ', data_list)

	// // Assemble the data arrays.
	// // First, create an object for each Y axis being displayed.
	// data = [];
	// for (i = 0; i < y_axis_columns.length; i++) {
	// 	data.push([]);
	// }

	// // Now, loop through the rows and add them to the series.
	// for (i = 0; i < data_list.length; i++) {
	// 	var row = data_list[i];
	// 	var x_value = row[x_axis_column];

	// 	if (chart_type !== "pie") {
	// 		var tmp = cmg.display.parse_float_liberally(x_value);
	// 		if (!isNaN(tmp)) {
	// 			x_value = tmp;
	// 		}
	// 	}

	// 	for (j = 0; j < y_axis_columns.length; j++) {
	// 		var value = row[y_axis_columns[j]];
	// 		data[j].push( [x_value, cmg.display.parse_float_liberally(value)] );
	// 	}
	// }

	// Data has been assembled.  Now let's prepare the chart element and then draw it.
	vis = d3.select("#dataVizChart")
		.append("svg")
		.attr({
			"width": width,
			"height": height
		})
			// is there a way around adding this group?
			.append("g")
			.attr({
				"transform": "translate(" + width / 2 + "," + height / 2 + ")"
			});

	// Set up the legend
	legend = d3.select("#dataVizLegend")
		.append("div")
		.attr({
			"class": "legend",
		})

	drawChart(vis, data_list);
}

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d[y_axis_columns]
	});

function drawChart(vis, data) {
	console.log('data: ', data)

	// var data = data[0]

	data.forEach(function(d) {
		d[y_axis_columns] = (d[y_axis_columns]).replace('$', '');
		console.log('d[y_axis_columns]: ', d[y_axis_columns])
	});

	var g = vis.selectAll(".arc")
			.data(pie(data))
		.enter().append("g")
			.attr({
				"class": function(d, i){
					return "arc p" + i
				}
			})
			.on("mouseover", function (d, i) {
				var _this = d3.select(this)
				var _el = d3.select('.result.p' + i + ' .color')
				var _text = d3.select('.result.p' + i)
				animateOver(_this, _el, _text)
			})
			.on("mouseout", function (d, i) {
				var _this = d3.select(this)
				var _el = d3.select('.result.p' + i + ' .color')
				var _text = d3.select('.result.p' + i)
				animateOut(_this, _el, _text)
			})

	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) {
			return color(d[y_axis_columns]); 
		});

	drawLegend(data)
}

function drawLegend (data) {
	var total = d3.sum(data, function(d){
		return d[y_axis_columns]
	})

	var result = legend.selectAll('div')
			.data(pie(data))
		.enter().append("div")
			.attr({
				"class": function(d, i){
					return "result p" + i
				}
			})
		.on("mouseover", function (d, i) {
			var _this = d3.select(this)
			var _el = d3.select('.arc.p' + i + ' .color')
			var _text = d3.select('.result.p' + i)
			animateOver(_el, _this, _text)
		})
		.on("mouseout", function (d, i) {
			var _this = d3.select(this)
			var _el = d3.select('.arc.p' + i + ' .color')
			var _text = d3.select('.result.p' + i)
			animateOut(_el, _this, _text)
		})

	result.append('span')
		.attr({
			class: 'color'
		})
		.style({
			"background-color": function(d) {
				return color(d[y_axis_columns]); 
			},
			"opacity": out_opacity
		})

	result.append('span')
		.text(function(d) {
			return d[x_axis_column];
		});

	result.append('span')
		.text(function(d) {
			return (Math.round((d[y_axis_columns]/total) * 100)) + '%';
		});
}

// animations
function animateOver(_this, _el, _text){
	_this
		.transition()
			.delay(0)						       
        	.duration(300)
        	.ease("linear")
        	.style({
        		"opacity": over_opacity
        	})

	_el
		.transition()
			.delay(0)						       
        	.duration(300)
        	.ease("linear")
        	.style({
        		"opacity": over_opacity
        	})

	_text
		.transition()
			.delay(0)						       
        	.duration(100)
        	.ease("linear")
        	.style({
        		"color": function(d){
        			return color(d.data[1])
        		}
        	})
}

function animateOut(_this, _el, _text){
	_this
		.transition()
			.delay(0)						       
        	.duration(200)
        	.ease("linear")
        	.style({
        		"opacity": out_opacity
        	})

	_el
		.transition()
			.delay(0)						       
        	.duration(200)
        	.ease("linear")
        	.style({
        		"opacity": out_opacity
        	})

	_text
		.transition()
			.delay(0)						       
        	.duration(100)
        	.ease("linear")
        	.style({
        		"color": color_legend_text
        	})
}

cmg.query(function () {
	cmg.display.read_data(setupChart, null);
});