// http://api.usatoday.com/open/census/hou?api_key=cnuurrmbcaya2snguar74zkv&callback=?

var padding = 10,
	radius = 74

var color = d3.scale.category20c()

var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - 30)

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d){
		return d.housing
	})

d3.csv('data/example09.csv', function(error, data){
	
	color.domain(d3.keys(data[0]).filter(function(key){
		return key !== 'State'
	}))

	data.forEach(function(d){
		d.numbers = color.domain().map(function(name){
			return {
				name: name,
				housing: +d[name]
			}
		})
	})

	var vis = d3.select('#example').selectAll('pie')
			.data(data)
		.enter().append('svg')
		.attr({
			'class': 'pie',
			'width': radius * 2,
			'height': radius * 2
		})
		.append('g')
		.attr({
			'transform': 'translate(' + radius + ', ' + radius  + ')'
		})

	console.log('data: ', data)

	vis.selectAll('arc')
			.data(function(d){
				return d.numbers
			})
		.enter().append('arc')
		.attr({
			'class': 'arc',
			'd': arc,
			// 'fill': function(d){
			// 	return color(d.data.name)
			// }
		})
})