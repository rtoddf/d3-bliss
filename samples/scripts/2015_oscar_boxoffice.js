// http://bl.ocks.org/Matthew-Weber/5645518

// axis styling: http://bl.ocks.org/mbostock/3371592

var container_parent = $('.display'),
    chart_container = $('#chart'),
    margins = {top: 20, right: 20, bottom: 20, left: 40},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.4) - margins.top - margins.bottom,
    vis, vis_group, aspect, tooltip

vis = d3.select('#chart').append('svg')
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

aspect = chart_container.width() / chart_container.height()

tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 1e-6)

var format = d3.format(',.0f')
var parseDate = d3.time.format('%d-%b-%y').parse
var dateFormat = d3.time.format('%m/%d/%y')

d3.json('data/2015_oscar_boxoffice.json', function(error, data){
    console.log('data: ', data)
    
    var american_sniper = data['American Sniper']
    var birdman = data['Birdman']
    var boyhood = data['Boyhood']
    var the_grand_budapest_hotel = data['The Grand Budapest Hotel']
    var the_imitation_game = data['The Imitation Game']
    var selma = data['Selma']
    var the_theory_of_everything = data['The Theory of Everything']
    var whiplash = data['Whiplash']  

    var initial_data_set = selma

    var xScale = d3.time.scale()
        .domain(d3.extent(initial_data_set, function(d) {
            return d.week;
        }))
        .range([0, width])

    var yScale = d3.scale.linear()
        .domain([ 0, 
            d3.max([ 
                d3.max(initial_data_set, function(d){
                    return d.average
                }), d3.max(initial_data_set, function(d){ 
                    return d.average
                })
            ])
        ])
        .range([ height, 0 ])

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(initial_data_set.length)
        // .tickFormat(d3.time.format('%m/%d'))
        .tickSize(-height, 0, -width)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(20)
        .tickSize(-width)
        .tickFormat(d3.format('.2s'))

    var xAxisGroup = vis_group.append('g')
        .attr({
            'class': 'x axis',
            'transform': 'translate(0, ' + height + ')'
        })
        .call(xAxis)

    var yAxisGroup = vis_group.append('g')
        .attr({
            'class': 'y axis',
            'transform': 'translate(0, 0)'
        })
        .call(yAxis)
        .append('text')
            .attr({
                'transform': 'rotate(-90)',
                'y': 6,
                'dy': '.71em',
                'fill': '#ccc'
            })
            .style({
                'text-anchor': 'end'
            })
            .text('Average Box Office ($)')

    var lineFunction = d3.svg.line()
        .x(function(d){ 
            return xScale(d.week)
        })
        .y(function(d){
            return yScale(d.average)
        })

    // append the line to the group
    vis_group.append('path')
        .attr({
            'class': 'line',
            'd': lineFunction(initial_data_set),
        })

    // append the circles to the group
    vis_group.selectAll('circle')
            .data(initial_data_set)
        .enter().append("circle")
            .attr({
                'class': 'dot',
                'r': 5,
                'fill': 'white',
                'cx': function(d) {
                    return xScale(d.week)
                },
                'cy': function(d) {
                    return yScale(d.average)
                }
            })
            .style('cursor', 'pointer')
            .on('mouseover', function(d) {
                tooltip
                    .html( '<span>' + dateFormat(parseDate(d.date)) + ': $' + format(d.average) + '</span>' )
                    .style({
                        'left': (d3.event.pageX) + 'px',
                        'top': (d3.event.pageY - 28) + 'px'
                    })
                    .transition()
                        .duration(500)
                        .style('opacity', 1) 
            })                
            .on('mouseout', function(d) {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0)
            })

    function animate(type){
        var duration = 750

        d3.selectAll('.line').transition()
            .duration(duration)
            .attr({
                'd': function(d){
                    return lineFunction(type)
                }
            })

        vis_group.selectAll('.dot')
            .data(type)
            .transition()
            .duration(duration)
            .attr({
                'cx': function(d) {
                    return xScale(d.week)
                },
                'cy': function(d) {
                    return yScale(d.average)
                }
            })
    }

    $('body').on('click', '[rel="program-share-modal"]', function( e ) {
        e.preventDefault()
        var dataType = $(this).data('type')

        switch (dataType) {
            case 'American Sniper':
                the_data = american_sniper
                break;
            case 'Birdman':
                the_data = birdman
                break;
            case 'Boyhood':
                the_data = boyhood
                break;
            case 'The Grand Budapest Hotel':
                the_data = the_grand_budapest_hotel
                break;
            case 'The Imitation Game':
                the_data = the_imitation_game
                break;
            case 'Selma':
                the_data = selma
                break;
            case 'The Theory of Everything':
                the_data = the_theory_of_everything
                break;
            case 'Whiplash':
                the_data = whiplash
                break;
            default:
                the_data = browse
        }

        animate(the_data)
    })
})
