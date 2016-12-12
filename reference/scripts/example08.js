// This constructs a new linear scale with the default domain [0,1] to range [0,1] which produces a mapping of 1:1.
// This default linear scale acts like the identity function for numbers
var identityScale = d3.scale.linear()

console.log(identityScale(1))

// We can override the default domain by specifying the domain using chained syntax.
// As we did not change the range, we are mapping the domain of 0 to 10000 onto 0 to 1.
var domainOnlyScale = d3.scale.linear()
						.domain([0,10000])

console.log(domainOnlyScale(1))

// We can override the default range by specifying the range using chained syntax.
var domainRangeScale = d3.scale.linear()
						.domain([0, 10000])
						.range([0 , 100])

console.log(domainRangeScale(5000))

// d3.max
var initialScaleData = [0, 1000, 3000, 2000, 5000, 4000, 7000, 6000, 9000, 8000, 10000]
var maxInitialData = d3.max(initialScaleData)
console.log(maxInitialData)

// d3.min
var minInitialData = d3.min(initialScaleData)
console.log(minInitialData)

var y = d3.scale.linear()
		.domain([ 0, 120 ])
		.range([ 20, 80 ])
console.log('y1: ', y(0)) // outputs 20
console.log('y2: ', y(130))

/* using domain and range with colors */

var color01 = '#baba71'
var color02 = '#003264'

var colors = d3.scale.linear()
		.domain([ 0, 100 ])
		.range([ color01, color02 ])
console.log('colors: ', colors(50))

var width = 200,
		height = 200

var svgContainer = d3.select('#example')
		.append('svg')
		.attr({
			'width': width,
			'height': height
		})

var rect = svgContainer.append('rect')		
		.attr({
			'width': 100,
			'height': 100,
			'fill': colors(50)
		})

/* clamp */
var clamp = d3.scale.linear()
		.domain([ 0, 100 ])
		.range([ 0, 1000 ])

console.log('clamp: ', clamp(120))
clamp.clamp(true)
console.log('clamp: ', clamp(120))

/* nice() */

var data = [-2.567, 7.985, -100.1, 12, 1.145]

var data_max = d3.max(data)
var data_min = d3.min(data)

var scale = d3.scale.linear()
		.domain([ 0, 100 ])
		.range([ data_min, data_max ])

console.log('nice: ', scale(0))
console.log('range: ', scale.range())
console.log('nice2: ', scale.nice()) // huh?

/* ticks */

var svgConatiainer02 = d3.select('#example01')
		.append('svg')
		.attr({
			'width': width,
			'height': height
		})

var tick_data = d3.scale.linear()
		.domain([0, 100])
		.range([0, width])

var ticks = svgConatiainer02.selectAll('line')
		.data(tick_data.ticks(4))
	.enter().append('line')
		.attr({
			'x1': 0,
			'y1': tick_data,
			'x2': 5,
			'y2': tick_data,
			'stroke': 'black',
			'stroke-width': 4
		})

console.log('tick: ', tick_data.ticks(4))

//.rangeRound()
// If used instead of .range(), this will guarantee that the output of the scales are integers, which is better to position marks on the screen with pixel precision than numbers with decimals.

var ordinal = d3.scale.ordinal()
		.domain([])
		.range(['hello', 'world'])


console.log('ordinal: ', ordinal(0))
console.log('ordinal: ', ordinal(1))
console.log('ordinal: ', ordinal(2))
console.log('ordinal: ', ordinal.domain())