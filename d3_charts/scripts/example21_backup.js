var limit = 10

var vis = d3.select('#example')
	.append('svg')
		.attr({
			'width': 800,
			'height': 1200
		})

var isDefined = function(obj){
	return typeof(obj) !== 'undefined' && obj !== null ? obj : '' 
}

function Item(item){
	this.rank = isDefined(parseInt((item.rank).slice(0, -1)))
	this.title = isDefined(item.PageTitle)
	this.instances = isDefined(parseInt(item.Instances))
	this.percentage = isDefined(item.percentage)
}


var pack = d3.layout.pack()
	.size([800, 1200])
	.padding(10)

d3.csv('data/ajc_2013.csv', function(error, csv) {

	var data = { name: "cheeses", children: csv };

	// data.forEach(function(d, i){
	// 	var item = new Item(d)
	// 	dataStuff.push(item)
	// })

	console.log(data)
	var node = vis.data([data]).selectAll("circle")
      .data(pack.nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      // .attr("r", function(d) { return d.r; });

		// var node = vis.selectAll('.node')
		// .data(dataStuff)
		// .enter().append('g')
		// 	.attr({
		// 		'class': 'node',
		// 		'transform': function(d){
		// 			return 'translate(' + d.x + ', ' + d.y + ')'
		// 		}
		// 	})

		// node.append('circle')
		// 	.attr({
		// 		'r': function(d){
		// 			return d.r
		// 		},
		// 		'fill': 'red',
		// 		'opacity': .25,
		// 		'stroke': 'grey',
		// 		'stroke-width': 2
		// 	})

		// for(var i = 0; i < data.length; i++){
		// 	var rank = parseInt((data[i].rank).slice(0,-1))
		// 	console.log(rank)
		// }

		// data.forEach(function(d, i){

			// var rank = function(d){
			// 	return parseInt(d.rank.slice(0,-1))
			// 	console.log(rank)
			// 	// parseInt((data[i].rank).slice(0,-1))
			// }

				// vis.selectAll('text')
				//       .data(data)
				//     .enter().append('text')
				//       .attr({
				//       	'class': 'text',
				//       	'y': function(d, i){
				//       		return (i + 2) * 20
				//       	}
				//       })
				//       .text(function(d){
				//       	return d.rank + ' ' + d.PageTitle + ', ' + d.Instances + ', ' + d.percentage
				//       })
		// })
	})