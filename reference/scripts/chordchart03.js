// http://bost.ocks.org/mike/uberdata/

var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = container_parent.width() - margins.top - margins.bottom,
	outerRadius = Math.min(width, height) / 2 - 10,
	innerRadius = outerRadius - 200,
	vis, vis_group, aspect,
	padding = .02

var formatPercent = d3.format('.1%')

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)

var layout = d3.layout.chord()
	.padding(padding)
	.sortSubgroups(d3.descending)
	.sortChords(d3.ascending)

var path = d3.svg.chord()
	.radius(innerRadius)

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + width + ' ' + height
	})

vis_group = vis.append('g')
		.attr({
			'id': 'circle',
			'transform': 'translate(' + width / 2 + ', ' + height / 2 + ')'
		})

aspect = chart_container.width() / chart_container.height()

vis_group.append('circle')
	.attr({
		'r': outerRadius
	})

d3.csv('data/example08c_cities.csv', function(cities) {
	console.log(cities)
	d3.json('data/example08c_matrix.json', function(matrix) {
		console.log(matrix)

		// Compute the chord layout.
		layout.matrix(matrix)

		// Add a group per neighborhood.
		var group = vis_group.selectAll('.group')
			.data(layout.groups)
				.enter().append('g')
			.attr({
				'class': 'group'
			})
			// .on('mouseover', mouseover)

		// Add a mouseover title.
		group.append('title').text(function(d, i) {
			return cities[i].name + ': ' + formatPercent(d.value) + ' of origins'
		})

		// Add the group arc.
		var groupPath = group.append('path')
			.attr({
				'id': function(d, i) {
					return 'group' + i
				},
				'd': arc,
				'fill': function(d, i) {
					return cities[i].color
				}
			})

		// Add a text label.
		var groupText = group.append('text')
			.attr({
				'x': 6,
				'dy': 15
			})

		groupText.append('textPath')
			.attr({
				'xlink:href': function(d, i) {
					return '#group' + i
				}
			})
			.text(function(d, i) {
				return cities[i].name
			})

		// Remove the labels that don't fit. :(
		groupText.filter(function(d, i) {
				return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength()
			})
			.remove()

		// Add the chords.
		var chord = vis_group.selectAll('.chord')
			.data(layout.chords)
				.enter().append('path')
			.attr({
				'class': 'chord',
				'fill': function(d) {
					return cities[d.source.index].color
				},
				'd': path
			})

		// Add an elaborate mouseover title for each chord.
		chord.append('title').text(function(d) {
			return cities[d.source.index].name
				+ ' → ' + cities[d.target.index].name
				+ ': ' + formatPercent(d.source.value)
				+ '\n' + cities[d.target.index].name
				+ ' → ' + cities[d.source.index].name
				+ ': ' + formatPercent(d.target.value)
		})

		// function mouseover(d, i) {
		// 	chord.classed('fade', function(p) {
		// 	return p.source.index != i
		// 		&& p.target.index != i
		// 	})
		// }
	})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})