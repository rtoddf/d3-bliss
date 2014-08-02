cmg.query(document).ready(function($){
	// OPTIONS THE ADMIN
	var chart_type = 'pie';

	// DATA SORTERS AND LABELS
	var pie_labels = 'race',
		pie_values = 'percent';

	// ANIMTAION VARS - NOT OPTIONS
	var out_opacity = 1,
		over_opacity = .7,
		color_legend_text = '#333'

	// GENERAL VARS
	var vis, vis_group, legend, aspect;

	// COLORS
	var color = d3.scale.category20();
	// var color = d3.scale.category10();
	// var color = d3.scale.category20b();
	// var color = d3.scale.category20c();

	// MARGINS - we need to set default margins, but there need to be options in
	// the admin for a producer to overwrite in case there labels on 
	// any axis are longer then the defaults
	var margins = {top: 20, right: 20, bottom: 50, left: 50}
	
	var container_parent =  $('#dataVizChart').parent(),
		chart_container = $('#dataVizChart'),
		width = container_parent.width() - margins.left - margins.right,
		height = (width * .66) - margins.top - margins.bottom

	// pie chart specfic vars
	var radius = Math.min(width, height) / 2,
		arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(radius * .25);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d[pie_values];
		});

	// chart and data set up
	function setupChart() {
		// all charts need this lines to convert to a json object
		var $ = cmg.query;
		var data_list = cmg.display.data[0];
		var data = [];
		for(var i in data_list) data.push(data_list[i]);

		// append the svg for drawing the chart
		vis = d3.select('#dataVizChart')
			.append('svg')
			.attr({
				'width': width + margins.left + margins.right,
				'height': height + margins.top + margins.bottom,
				'preserveAspectRatio': 'xMinYMid',
				'viewBox': '0 0 ' + width + ' ' + height
			})

		vis_group = vis.append('g')
			.attr({
				'transform': 'translate(' + width / 2 + ',' + height / 2 + ')'
			});

		// set the aspect ratio for responsive resizing
		aspect = chart_container.width() / chart_container.height();

		// set up the legend
		legend = d3.select('#dataVizLegend')
			.append('div')
			.attr({
				'class': 'legend',
			})

		drawChart(data);
	}

	function drawChart(data) {
		var g = vis_group.selectAll('.arc')
				.data(pie(data))
			.enter().append('g')
				.attr({
					'class': function(d, i){
						return 'arc p' + i
					}
				})
				.on('mouseover', function (d, i) {
					var _arc = d3.select(this)
					var _el = d3.select('.legend-result.p' + i + ' .legend-box-color')
					var _text = d3.select('.legend-result.p' + i)
					animateOver(_arc, _el, _text)
				})
				.on('mouseout', function (d, i) {
					var _arc = d3.select(this)
					var _el = d3.select('.legend-result.p' + i + ' .legend-box-color')
					var _text = d3.select('.legend-result.p' + i)
					animateOut(_arc, _el, _text)
				})

		g.append('path')
			.attr({
				'd': arc,
				'fill': function(d) {
					return color(d.value); 
				}
			})

		g.append('text')
			.attr({
				'class': function(d, i){
					return 'pie_label p' + i
				},
				'dy': '.35em',
				'transform': function(d) {
				    var c = arc.centroid(d),
				        x = c[0],
				        y = c[1],
				        // pythagorean theorem for hypotenuse
				        h = Math.sqrt(x*x + y*y);
				    	return 'translate(' + (x/h * radius) +  ',' + (y/h * radius) +  ')';
				},
				'text-anchor': function(d) {
				    // are we past the center?
				    return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start';
				    },
				'fill': color_legend_text
			})
			.text(function(d) {
				return d.data[pie_labels]; 
			});

		drawLegend(data);
	}

	function drawLegend (data) {
		var total = d3.sum(data, function(d){
			return d[pie_values];
		})

		var result = legend.selectAll('div')
				.data(pie(data))
			.enter().append('div')
				.attr({
					'class': function(d, i){
						return 'legend-result p' + i
					}
				})
			.on('mouseover', function (d, i) {
				var _arc = d3.select('.arc.p' + i)
				var _el = d3.select('.legend-result.p' + i + ' .legend-box-color')
				var _text =  d3.select(this)
				animateOver(_arc, _el, _text)
			})
			.on('mouseout', function (d, i) {
				var _arc = d3.select('.arc.p' + i)
				var _el = d3.select('.legend-result.p' + i + ' .legend-box-color')
				var _text = d3.select(this)
				animateOut(_arc, _el, _text)
			})

		result.append('span')
			.attr({
				class: 'legend-box-color'
			})
			.style({
				'background-color': function(d) {
					return color(d.value); 
				},
				'opacity': out_opacity
			})

		result.append('span')
			.text(function(d) {
				return d.data[pie_labels];
			});

		result.append('span')
			.text(function(d) {
				return (Math.round((d.data[pie_values]/total) * 100)) + '%';
			});
	}

	// animations
	function animateOver(_arc, _el, _text){
		console.log(_el)
		_arc
			.transition()
				.delay(0)						       
	        	.duration(300)
	        	.ease('linear')
	        	.style({
	        		'opacity': over_opacity
	        	})

		_el
			.transition()
				.delay(0)						       
	        	.duration(300)
	        	.ease('linear')
	        	.style({
	        		'opacity': over_opacity
	        	})

		_text
			.transition()
				.delay(0)						       
	        	.duration(100)
	        	.ease('linear')
	        	.style({
	        		'color': function(d){
	        			return color(d.value)
	        		}
	        	})
	}

	function animateOut(_arc, _el, _text){
		_arc
			.transition()
				.delay(0)						       
	        	.duration(200)
	        	.ease('linear')
	        	.style({
	        		'opacity': out_opacity
	        	})

		_el
			.transition()
				.delay(0)						       
	        	.duration(200)
	        	.ease('linear')
	        	.style({
	        		'opacity': out_opacity
	        	})

		_text
			.transition()
				.delay(0)						       
	        	.duration(100)
	        	.ease('linear')
	        	.style({
	        		'color': color_legend_text
	        	})
	}

	$(window).on('resize', function() {
	    var targetWidth = container_parent.width();
	    vis
		    .attr({
		    	'width': targetWidth,
		    	'height': Math.round(targetWidth / aspect)
		    })
	})

	cmg.query(function () {
		cmg.display.read_data(setupChart, null);
	});

});