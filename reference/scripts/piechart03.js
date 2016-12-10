var width = $('#chartPie').width(),
    height = 1200,
    pieWidth = width * .33,
    pieHeight = width * .33,
    pieMargin = 40,
    radius = Math.min(pieWidth, pieHeight) / 2,
    lineHeight = 22

var vis = d3.select('#chartPie')
	.append('svg')
		.attr({
			'width': pieWidth,
			'height': pieHeight
		})

var group = vis
		.append('g')
			.attr('transform', 'translate(' + pieWidth / 2 + ',' + pieHeight / 2 + ')')

var color = d3.scale.category20b()

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(50);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){
    	return d.Instances * .5
    })

d3.csv('data/example05c.csv', function(error, data) {

	var g = group.selectAll('.arc')
	  .data(pie(data))
	.enter().append('g')
	  .attr('class', 'arc')

	g.append('path')
	  .attr({
	  	'd': arc
	  })
	  .style('fill', function(d){
	  	return color(d.data.rank)
	  })

	g.append('text')
		.attr('transform', function(d){
			return 'translate(' + arc.centroid(d) + ')'
		})
		.attr('dy', '.35em')
		.style({
			'text-anchor': 'middle',
			'fill': 'white'
		})
		.text(function(d) {
			var percentNum = parseFloat((d.data.percentage).slice(0,-1))
			if(percentNum >= 1 ){
				return percentNum + '%'
			}
		})

	var textGroup = d3.select('#chartText')


	var text = textGroup.selectAll('text')
			.data(data)
		.enter().append('g')
			.attr({
				'class': 'rule',
				'transform': function(d, i){
					return 'translate(0, ' + ((i + 2) * lineHeight) + ')'
				}
			})

	var rank = text
			.append('text')
				.attr({
					'class': 'rank'
				})
				.text(function(d){
					return d.rank
				})

	var title = text
			.append('text')
				.attr({
					'class': 'title'
				})
				.text(function(d){
					return d.PageTitle
				})

	var instances = text
			.append('text')
				.attr({
					'class': 'instances'
				})
				.text(function(d){
					return d.Instances
				})

	var percentage = text
			.append('text')
				.attr({
					'class': 'percentage'
				})
				.text(function(d){
					return d.percentage
				})
})