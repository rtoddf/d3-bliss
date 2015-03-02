var container_parent = $('.display') ,
    chart_container = $('#chart'),
    width = container_parent.width(),
    height = width,
    vis, vis_group, aspect

var box_width = width/17,
    box_height = width/17

d3.json('data/periodic_table.json', function(error, data){
    data = data.elements
    console.log(data)

    vis = d3.select('#chart').selectAll('svg')
        .data(data)
            .enter().append('svg')
        .attr({
            'width': box_width,
            'height': box_height
        })
        .on('mouseover', function(d){
            d3.select(this).selectAll('rect')
                .transition()
                    .duration(200)
                    .attr({
                        // 'transform': 'translate(-5, -5)',
                        'width': box_width + 10,
                        'height': box_height + 10
                    })
                .style({
                    'cursor': 'pointer'
                })

            d3.select(this).selectAll('text')
                .transition()
                    .duration(200)
                    .attr({
                        'font-size': '32px',
                        'transform': 'translate(0, 10)',
                        'fill': 'white'
                    })
        })


    vis_group = vis.append('g')
        .attr({
            'class': 'vis_group',
            'transform': 'scale(.9)'
        })
        .append('rect')
            .attr({
                'width': box_width,
                'height': box_height,
                'fill': function(d){
                    return 'red'
                },
                'transform': 'translate(5, 5)'
            })

    vis.append('text')
        .attr({
            'x': 27,
            'y': 25,
            'class': 'pie_label',
            'dy': '.35em',
            'text-anchor': 'middle'
        })
        .text(function(d){
            return d.symbol
        })
})
