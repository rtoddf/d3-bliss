var container_parent = $('.display'),
	chart_container = $('#periodic_table'),
	margins = {top: 20, right: 40, bottom: 20, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width*.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

vis = d3.select('#periodic_table').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
    })

var defaults = {
	'non_metal': [
		{
			'stop': 0,
			'color': '#dcf1fd'
		},
		{
			'stop': .5,
			'color': '#45b2e5'
		},
		{
			'stop': 1,
			'color': '#66bcea'
		}
	],
	'alkali_metal': [
		{
			'stop': 0,
			'color': '#fbd3d4'
		},
		{
			'stop': .5,
			'color': '#ed2325'
		},
		{
			'stop': 1,
			'color': '#f04f3b'
		}
	],
    'alkaline_earth': [
        {
            'stop': 0,
            'color': '#ffdebf'
        },
        {
            'stop': .5,
            'color': '#f68822'
        },
        {
            'stop': 1,
            'color': '#f78f2c'
        }
    ],
    'noble_gas': [
        {
            'stop': 0,
            'color': '#d1bbda'
        },
        {
            'stop': .5,
            'color': '#6a53a3'
        },
        {
            'stop': 1,
            'color': '#6d54a3'
        }
    ],
}

var defs = vis_group.append('defs')

defs.append('linearGradient')
	.attr({
		'id': 'non_metal',
		'xlink:href': '#non_metal',
		'x1': 0,
		'y1': 0,
		'x2': 1,
		'y2': 1,
		'x3': 2,
		'y3': 2
	})
	.selectAll('stop')
		.data(defaults.non_metal)
			.enter().append('stop')
		.attr({
			'offset': function(d){
				return d.stop
			}
		})
		.style({
			'stop-color': function(d){
				return d.color
			}
		})

defs.append('linearGradient')
	.attr({
		'id': 'alkali_metal',
		'xlink:href': '#alkali_metal',
		'x1': 0,
		'y1': 0,
		'x2': 1,
		'y2': 1,
		'x3': 2,
		'y3': 2
	})
	.selectAll('stop')
		.data(defaults.alkali_metal)
			.enter().append('stop')
		.attr({
			'offset': function(d){
				return d.stop
			}
		})
		.style({
			'stop-color': function(d){
				return d.color
			}
		})

defs.append('linearGradient')
    .attr({
        'id': 'alkaline_earth',
        'xlink:href': '#alkaline_earth',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.alkaline_earth)
            .enter().append('stop')
        .attr({
            'offset': function(d){
                return d.stop
            }
        })
        .style({
            'stop-color': function(d){
                return d.color
            }
        })

defs.append('linearGradient')
    .attr({
        'id': 'noble_gas',
        'xlink:href': '#noble_gas',
        'x1': 0,
        'y1': 0,
        'x2': 1,
        'y2': 1,
        'x3': 2,
        'y3': 2
    })
    .selectAll('stop')
        .data(defaults.noble_gas)
            .enter().append('stop')
        .attr({
            'offset': function(d){
                return d.stop
            }
        })
        .style({
            'stop-color': function(d){
                return d.color
            }
        })
