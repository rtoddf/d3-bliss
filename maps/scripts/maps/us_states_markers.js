var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.width(),
    height = (width * .6),
    vis, vis_group, aspect

var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([ width/2, height/2 ])

var path = d3.geo.path()
    .projection(projection)

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 1e-6)

vis = d3.select('#map').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()
var names = {}
var data_set
var party_map = true,
	same_sex_map = false,
	age_of_consent_map = false

d3.tsv('../data/us-state-names.tsv', function(tsv){
	tsv.forEach(function(d, i){
		names[d.id] = {
			'name': d.name,
			'code': d.code
		}
	})
})

queue()
    .defer(d3.json, '../data/us.json')
    .defer(d3.json, '../data/us_cities.json')
    .await(ready);

function ready(error, topology, cities) {
	var route = function(){
		var coordinates = cities.map(function(c){
			return [parseInt(c.location.lon), parseInt(c.location.lat)]
		})
		return {
			type: 'LineString',
			coordinates: coordinates
		}
	}

	// draws the state shapes
	vis_group.selectAll('path')
			.data(topojson.feature(topology, topology.objects.states).features)
		.enter().append('path')
		.attr({
			'd': path,
			'class': 'stats',
			'fill': function(d){
				return '#baba71'
			},
			'stroke': '#fff',
			'strokeWidth': 2,
		})

	// vis_group.append('circle').attr('r',5).attr('transform', function() {return 'translate(' + projection([-75,43]) + ')';});
	vis_group.selectAll('circle')
			.data(cities)
		.enter().append('circle')
			.attr({
				'r': 5,
				'transform': function(d) {
					console.log('d: ', d)
					return 'translate(' + projection([ d.location.lon, d.location.lat ]) + ')'
				},
				'fill': 'white',
				'stroke': 'black',
				'stroke-width': .5
			})
			.style({
				'cursor': 'pointer'
			})
			.each(function(d) {
				d3.select(this).on('mouseover', user_interaction)
				d3.select(this).on('mouseout', user_interaction)
			})

	// vis_group.append('path')
	// 	.datum(route)
	// 	.attr({
	// 		'd': path,
	// 		'fill': 'none',
	// 		'stroke': 'black',
	// 		'stroke-width': 1
	// 	})

	// , 

	function user_interaction(d){
	//     var fill = function(){
	//         // TODO: clean this up
	//         if(party_map){
	//             return state_party_fill(d)
	//         } else if(age_of_consent_map){
	//             return state_consent_fill(d, data_set)
	//         } else if(same_sex_map) {
	//             return state_data_fill(d, data_set)
	//         }
	//     }

	//     var html = function(){
	//         // TODO: clean this up
	//         if(party_map){
	//             return names[d.id]['party']
	//         } else if(age_of_consent_map){
	//             return names[d.id]['age_of_consent']
	//         } else if(same_sex_map) {
	//             return names[d.id]['same_sex_marriage']
	//         }
	//     }

	    var tooltip_opacity = d3.event.type == 'mouseover' ? 1 : 0
	//     var fill_color = d3.event.type == 'mouseover' ? '#666' : fill()
		
	    d3.select('.tooltip')
	        .html( '<span>' + d.name + '</span>' )
	        .style({
	            'left': (d3.event.pageX) + 'px',
	            'top': (d3.event.pageY - 28) + 'px'
	        })
	        .transition()
	            .duration(500)
	            .style({
	                'opacity': tooltip_opacity
	            }) 

	//     d3.select(this)
	//         .transition()
	//             .duration(200)
	//             .attr({
	//                 'fill': fill_color
	//             })
	}
}
