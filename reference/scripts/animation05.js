var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

d3.select("input[value=\"total\"]").property('checked', true);

var radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;


vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + width + ' ' + height
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + width/2 + ', ' + height/2 + ')'
	})

vis_group.append('g')
	.attr({
		'class': 'slices'
	});

vis_group.append('g')
	.attr({
		'class': 'labelName'
	});

vis_group.append('g')
	.attr({
		'class': 'labelValue'
	});

vis_group.append('g')
	.attr({
		'class': 'lines'
	});

var div = d3.select('body')
	.append('div')
	.attr({
		'class': 'toolTip'
	});

vis_group.attr({
	'transform': 'translate(' + width / 2 + ',' + height / 2 + ')'
});

var colorRange = ['#a2d86c', '#b9fc74', '#fafc5c', '#fac457', '#fa625c', '#444'];
// var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
	.range(colorRange);

// datasetEvenedOut = [
//     {label: 'Low (0-2.4)', value: 1}, 
//     {label: 'Low-Medium (2.5-4.8)', value: 1}, 
//     {label: 'Medium (4.9-7.2)', value: 1},
//     {label: 'Medium-High (7.3-9.6)', value: 1},
//     {label: 'High (9.7-12)', value: 1},
//     {label: 'Remainder', value: 1+1}
// ];



// datasetTotal = [
// 	{label: 'Low (0-2.4)', value: 5}, 
// 	{label: 'Low-Medium (2.5-4.8)', value: 10}, 
// 	{label: 'Medium (4.9-7.2)', value: 15},
// 	{label: 'Medium-High (7.3-9.6)', value: 20},
// 	{label: 'High (9.7-12)', value: 25},
// 	{label: 'Remainder', value: remainder()}
// ];

var totalPossible = 100

var remainder = function(m){
	var startCount = 0;

	$.each(m, function(i, j){
		if(i < m.length-1){
		  startCount += j.value
		}
	})

	return totalPossible-startCount
}

datasetTotal = [
	{label: 'Low (0-2.4)', value: 1}, 
    {label: 'Low-Medium (2.5-4.8)', value: 2}, 
    {label: 'Medium (4.9-7.2)', value: 3},
    {label: 'Medium-High (7.3-9.6)', value: 4},
    {label: 'High (9.7-12)', value: 5}
];

datasetTotal.push({
	label: 'Remainder', value: remainder(datasetTotal)
})

console.log(datasetTotal)

datasetOption1 = [
	{label: 'Low (0-2.4)', value: 22}, 
	{label: 'Low-Medium (2.5-4.8)', value: 33}, 
	{label: 'Medium (4.9-7.2)', value: 4},
	{label: 'Medium-High (7.3-9.6)', value: 15},
	{label: 'High (9.7-12)', value: 36},
	{label: 'Remainder', value: 0}
]; 

datasetOption2 = [
	{label: 'Low (0-2.4)', value: 10}, 
	{label: 'Low-Medium (2.5-4.8)', value: 20}, 
	{label: 'Medium (4.9-7.2)', value: 30},
	{label: 'Medium-High (7.3-9.6)', value: 5},
	{label: 'High (9.7-12)', value: 12},
	{label: 'Remainder', value: 23}
];

change(datasetTotal);

d3.selectAll('input')
	.on('change', selectDataset);
	
function selectDataset() {
	var value = this.value;

	if (value == 'even') {
		change(datasetEvenedOut);
	} else if (value == 'option1') {
		change(datasetOption1);
	} else if (value == 'option2') {
		change(datasetOption2);
	} else if (value == 'total') {
		change(datasetTotal);
	}
}

function change(data) {
	/* ------- PIE SLICES -------*/
	var slice = vis_group.select(".slices").selectAll("path.slice")
		.data(pie(data), function(d){
			return d.data.label
		});

	slice.enter()
		.insert('path')
		.style({
			'fill': function(d) {
				return color(d.data.label)
			}
		})
		.attr({
			'class': 'slice'
		});

	slice
		.transition()
		.duration(1000)
		.attrTween('d', function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice
		.on('mousemove', function(d){
			div.style({
				'left': d3.event.pageX + 10 + 'px',
				'top': d3.event.pageY - 25 + 'px',
				'display': 'inline-block'
			});
			div.html((d.data.label) + '<br>' + (d.data.value) + '%');
		});

	slice
		.on('mouseout', function(d){
			div.style({
				'display': 'none'
			});
		});

	slice.exit()
		.remove();

	var legend = vis_group.selectAll('.legend')
		.data(color.domain())
		.enter()
		.append('g')
		.attr({
			'class': 'legend',
			'transform': function(d, i) {
				var height = legendRectSize + legendSpacing;
				var offset =  height * color.domain().length / 2;
				var horz = -3 * legendRectSize;
				var vert = i * height - offset;
				return 'translate(' + horz + ',' + vert + ')';
			}
		})

	legend.append('rect')
		.attr({
			'width': legendRectSize,
			'height': legendRectSize
		})
		.style({
			'fill': color,
			'stroke': color
		})

	legend.append('text')
		.attr({
			'x': legendRectSize + legendSpacing,
			'y': legendRectSize - legendSpacing
		})
		.text(function(d) {
			return d;
		});

	/* ------- TEXT LABELS -------*/
	var text = vis_group.select('.labelName')
		.selectAll('text')
			.data(pie(data), function(d){
				return d.data.label
			});

	text.enter()
		.append('text')
		.attr({
			'dy': '.35em'
		})
		.text(function(d) {
			return (d.data.label + ': ' + d.value + '%');
		});

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text
		.transition()
		.duration(1000)
		.attrTween('transform', function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return 'translate(' + pos + ')';
			};
		})
		.styleTween('text-anchor', function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? 'start':'end';
			};
		})
		.text(function(d) {
			return (d.data.label + ': ' + d.value + '%');
		});


	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/
	var polyline = vis_group.select('.lines')
		.selectAll('polyline')
			.data(pie(data), function(d){
				return d.data.label
			});

	polyline.enter()
		.append('polyline');

	polyline.transition().duration(1000)
		.attrTween('points', function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		});

	polyline.exit()
		.remove();
};