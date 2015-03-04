var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * .5),
	vis, vis_group, aspect, centered, response

var old_state

var apiBase = 'http://api.usatoday.com/open/',
	api = 'census/',
	apiType = 'rac',
	sumlevid = '&sumlevid=2',
	apiKey = '&api_key=cnuurrmbcaya2snguar74zkv',
	callback = '&callback=?'

var projection = d3.geo.albersUsa()
	.scale(width)
	.translate([ width/2, height/2 ])

var path = d3.geo.path()
	.projection(projection)

// do you have to have two?
var over_tooltip = d3.select('body').append('div')
	.attr({
        'class': 'over_tooltip'
    })
	.style({
        'opacity': 1e-6
    })

var tooltip = d3.select('body').append('div')
    .attr({
        'class': 'tooltip'
    })
    .style({
        'opacity': 1e-6
    })

vis = d3.select('#map').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

// draw the background rect for clicking (zoom out) purposes
vis.append('rect')
	.attr({
		'class': 'background',
		'width': width,
		'height': height,
		'data-type': function(d){
			return 'rect'
		},
	})
	.on({
		'click': clicked
	})

var g = vis.append('g')

d3.json('data/us-named-parties.json', function(error, topology){
	g.append('g')
		.selectAll('path')
			.data(topojson.feature(topology, topology.objects.states).features)
		.enter().append('path')
			.attr({
				'd': path,
				'data-type': function(d){
					return 'state'
				},
				'data-type-name': function(d){
					return d.properties.code
				},
                'fill': function(d){
                    var party = d.properties.party
                    if(party == 'republican'){
                        return '#e91d0e'
                    } else if(party == 'democratic'){
                        return '#003264'
                    } else {
                        return 'white'
                    }
                },
                'stroke': '#fff',
                'stroke-width': .5
			})
			.on({
				'click': clicked
			})
            .on('mouseover', function(d){
                d3.select(this)
                    .transition()
                        .duration(500)
                        .attr({
                            'fill': '#fff',
                            // 'stroke': '#000',
                            // 'strokeWidth': .5
                        })
                    .style('cursor', 'pointer')

                over_tooltip.html(function() {
                        var tooltip_template_raw = '<p><strong>' + d.properties.name + '</strong></p> \
                        <p>' + d.properties.code + ' State ID: ' + d.id + '</p> \
                        <p>Primary party: ' + _.capitalize(d.properties.party) + '</p>'

                        var tooltip_data = _.template(tooltip_template_raw, {
                            // state_info: stateData
                        })
                        return tooltip_data
                    })
                    .style({
                        'left': (d3.event.pageX) + 'px',
                        'top': (d3.event.pageY - 28) + 'px'
                    })
                    .transition()
                        .duration(500)
                        .style('opacity', 1) 
            })
            .on('mouseout', function(d){
                d3.select(this)
                    .transition()
                        .duration(500)
                        .attr({
                            'fill': function(d){
                                var party = d.properties.party
                                if(party == 'republican'){
                                    return '#e91d0e'
                                } else if(party == 'democratic'){
                                    return '#003264'
                                } else {
                                    return 'white'
                                }
                            }
                        })
                over_tooltip.transition()
                        .duration(200)
                        .style('opacity', 0) 
            })

        

	// g.append('path')
	// 	.datum(topojson.mesh(topology, topology.objects.states, function(a, b){
	// 		return a !== b
	// 	}))
	// 	.attr({
	// 		'id': 'state-borders',
	// 		'd': path
	// 	})
})

function clicked(d){
	var current_type = $(this).context.dataset.type
	if(current_type == 'state'){
		state = $(this).context.dataset.typeName
	}
	
	var keypat = '?keypat=' + state
	var searchString = apiBase + api + apiType + keypat + sumlevid + apiKey + callback

	// a return that is true of false?
	// this is a standard callback
	$.getJSON(searchString, function(data){
		drawIt(data.response[0])
	})

	var x, y, k

	var drawIt = function(stateData){

		if(d && centered !== d && current_type == 'state'){
			var centroid = path.centroid(d)
			x = centroid[0]
			y = centroid[1]
			k = 4
			centered = d

		} else {
			x = width / 2
			y = height / 2
			k = 1
			centered = null
		}

		g.selectAll('text')
			.transition()
				.duration(500)
				.attr({
					opacity: 0
				})
			.remove()

		if(current_type == 'state'){
			g.append('text')
				.attr({
					'fill': 'rgba(255,255,255,1)',
					'opacity': 0,
					'transform': 'translate(' + x + ',' + y + ')'
				})
				.text(state)
				.style({
					'text-anchor': 'middle'
				})
				.transition()
					.duration(750)
					.attr({
						opacity: 100
					})
		}

		if(current_type == 'rect'){
			tooltip.transition()
				.duration(500)
				.style({
                    'opacity': 0
                })
		}

		var p = $('#map'),
            position = p.position()

		var template_raw = '<h5>Race Info for ' + stateData.Placename + '</h5> \
			<ul class="list-unstyled"> \
			<li>Caucasian: ' + (stateData.PctWhite * 100).toFixed(2) + '%</li> \
			<li>African American: ' + (stateData.PctBlack * 100).toFixed(2) + '%</li> \
			<li>Asian American: ' + (stateData.PctAsian * 100).toFixed(2) + '%</li> \
			<li>American Indian: ' + (stateData.PctAmInd * 100).toFixed(2) + '%</li> \
			<li>Two or More: ' + (stateData.PctTwoOrMore * 100).toFixed(2) + '%</li> \
			<li>Hawaiian or Pacific Islander: ' + (stateData.PctNatHawOth * 100).toFixed(2) + '%</li> \
			</ul>'

		tooltip.html(function(d) {
				var tooltip_data = _.template(template_raw, {
					state_info: stateData
				})
				return tooltip_data
			})
			.style({
                'left': (position.left + width - 275) + 'px',
                'top': (position.top + 30) + 'px'
            })
            .transition()
                .duration(500)
                .style({
                    'opacity': 1
                })

		g.selectAll('path')
			.classed('active', centered && function(d){
				return d === centered
			})

		g.transition()
			.duration(750)
			.attr({
				'transform': 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')',
                'stroke-width': 1.5 / k + 'px'
			})
	}
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})
