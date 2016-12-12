console.log('huh')

d3.select('#example')
	.text('hey there')

d3.selectAll('#example02 p')
	.classed('goo', true)

d3.selectAll('#example02 p')
	.classed('goo', function(){
		return false
	})