var dataset = []

for(var i = 0; i < 25; i++){
	var newNum = Math.random() * 30
	dataset.push(newNum)
}

d3.select('#example').selectAll('div')
	.data(dataset)
		.enter().append('div')
	.classed('bar', true)
	.style({
		'height': function(d){
			var barHeight = d * 5
			return barHeight + 'px'
		}
	})