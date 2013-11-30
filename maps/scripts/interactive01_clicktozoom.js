var container_parent = $('.display') ,
	chart_container = $('#example'),
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

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 1e-6)

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

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

d3.json('../data/us-named-parties.json', function(error, us){
	g.append('g')
		.attr({
			'id': 'states'
		})
		.selectAll('path')
			.data(topojson.feature(us, us.objects.states).features)
		.enter().append('path')
			.attr({
				'd': path,
				'data-type': function(d){
					return 'state'
				},
				'data-type-name': function(d){
					return d.properties.code
				},
				'class': function(d){
					return d.properties.party
				}
			})
			.on({
				'click': clicked
			})

	g.append('path')
		.datum(topojson.mesh(us, us.objects.states, function(a, b){
			return a !== b
		}))
		.attr({
			'id': 'state-borders',
			'd': path
		})
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

		tooltip.transition()
			.duration(500)
			.style('opacity', 1)

		if(current_type == 'rect'){
			tooltip.transition()
				.duration(500)
				.style('opacity', 0)
		}

		var p = $('#example')
		var position = p.position()

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
			.style('left', (position.left + width - 275) + 'px')
			.style('top', (position.top + 30) + 'px')

		g.selectAll('path')
			.classed('active', centered && function(d){
				return d === centered
			})

		g.transition()
			.duration(750)
			.attr({
				'transform': 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')'
			})
			.style({
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