var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = +container_parent.width() - margins.left - margins.right,
	height = +(+container_parent.width() * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

vis = d3.select('svg')
	.attr('width', width)
	.attr('height', height)


// v3
// var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1)
// var y = d3.scale.linear().range([ height, 0 ])

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0]);

var vis_group = vis.append('g')
	.attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

d3.tsv('data/barchart01.tsv', function(d) {
	// make all intergers and positive
	d.frequency = +d.frequency;
	return d;
}, function(error, data) {
	// callback
	if (error) throw error;
	

	x.domain(data.map(function(d) {
		console.log('d.letter: ', d.letter)
		return d.letter;
	}));


	y.domain([0, d3.max(data, function(d) {
		console.log('d.frequency: ', d.frequency)
		return d.frequency;
	})]);

	vis_group.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x));

	vis_group.append('g')
		.attr('class', 'axis axis--y')
		.call(d3.axisLeft(y).ticks(10, '%'))
	.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('Frequency');

	vis_group.selectAll('.bar')
		.data(data)
		.enter().append('rect')
			.attr('class', 'bar')
			.attr('x', function(d) { return x(d.letter); })
			.attr('y', function(d) { return y(d.frequency); })
			.attr('width', x.bandwidth())
			.attr('height', function(d) { return height - y(d.frequency); })
			.attr('fill', 'lightblue');
})

// 