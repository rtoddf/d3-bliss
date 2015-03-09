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
var party_map = true

d3.tsv('../data/us-state-names.tsv', function(tsv){
    tsv.forEach(function(d, i){
        names[d.id] = {
            'name': d.name,
            'code': d.code,
            'party': d.party,
            'same_sex_marriage': d.same_sex_marriage
        }
    })
})

d3.json('../data/us.json', function(error, topology){
    // draw the US boundaries
    // vis_group.append('path')
    //     .datum(topojson.feature(topology, topology.objects.land))
    //     .attr({
    //         'd': path,
    //         'fill': defaults.land.fill,
    //         'stroke': defaults.land.stroke
    //     })

    console.log(topology)
    console.log(names)

    function state_party_fill(d){
        var party = names[d.id].party
        if(party == 'republican'){
            return '#e91d0e'
        } else if(party == 'democrat'){
            return '#003264'
        } else if(party == 'split'){
            return 'purple'
        } else {
            return 'white'
        }
    }

    function state_data_fill(d, data_set){
        var data_set = names[d.id][data_set]
        if(data_set == 'true'){
            return 'pink'
        } else if(data_set == 'false'){
            return '#999'
        } else {
            return 'white'
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
                return state_party_fill(d)
            },
            'stroke': '#fff',
            'strokeWidth': 2,
        })
        .style({
            'cursor': 'pointer'
        })
        .on('mouseover', function(d) {
            d3.select('.tooltip')
                .html( '<span>' + names[d.id]['code'] + ': ' + names[d.id]['name'] + '</span>' )
                .style({
                    'left': (d3.event.pageX) + 'px',
                    'top': (d3.event.pageY - 28) + 'px'
                })
                .transition()
                    .duration(500)
                    .style({
                        'opacity': 1
                    }) 

            d3.select(this)
                .transition()
                    .duration(500)
                    .attr({
                        'fill': '#fff'
                    })
        })
        .on('mouseout', function(d) {
            d3.select('.tooltip')
                .transition()
                    .duration(200)
                    .style('opacity', 0)
            d3.select(this)
                .transition()
                    .duration(200)
                    .attr({
                        'fill': function(d){
                            if(party_map){
                                return state_party_fill(d)
                            } else {
                                return state_data_fill(d, data_set)
                            }
                        }
                    })
        })

    function animate(data_set){
        
        if(data_set !== 'party'){
            party_map = false

            d3.selectAll('.stats')
                .transition()
                    .duration(400)
                    .ease('cubic')
                    .attr({
                        'fill': function(d){
                            return state_data_fill(d, data_set)
                        }
                    })
        } else {
            party_map = true

            d3.selectAll('.stats')
                .transition()
                    .duration(400)
                    .ease('cubic')
                    .attr({
                        'fill': function(d){
                            return state_party_fill(d)
                        }
                    })
        }        
    }

    $('body').on('click', '[rel="program-share-modal"]', function( e ) {
        e.preventDefault()
        data_set = $(this).data('type')

        animate(data_set)
    })
})
