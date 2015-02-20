var container_parent = $('.display'),
    chart_container = $('#example'),
    margins = {top: 20, right: 20, bottom: 20, left: 30},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.3) - margins.top - margins.bottom,
    vis, vis_group, aspect

(function () {
    queue()
        .defer(d3.json, 'data/example09a.json')
        .defer(d3.json, 'data/example09b.json')
        .await(ready)

    vis = d3.select('#example').append('svg')
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
})()

function ready(error, data1, data2){
    // Parse the date / time
    var parseDate = d3.time.format('%d-%b-%y').parse

    data1.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    })

    data2.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    var xScale = d3.time.scale()
        .domain(d3.extent(data1, function(d) {
            return d.date;
            
        }))
        .range([0, width])

    var yScale = d3.scale.linear()
        .domain([ 0, 
            d3.max([ 
                d3.max(data1, function(d){
                    return d.amount
                }), d3.max(data2, function(d){ 
                    return d.amount
                })
            ])
        ])
        .range([ height, 0 ])

    var lineFunction = d3.svg.line()
        .x(function(d){ 
            return xScale(d.date)
        })
        .y(function(d){
            return yScale(d.amount)
        })

    var linePath = vis_group.append('path')
        .attr({
            'class': 'line',
            'd': lineFunction(data1),
        })

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10)
        .tickFormat(d3.time.format("%m/%d"))
        .tickSize(-height, 0, 0)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')

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

    function animate(type){
        var duration = 750

        d3.selectAll('.line').transition()
            .duration(duration)
            .attr({
                'd': function(d){
                    return lineFunction(type)
                }
            })
    }


    $('body').on('click', '[rel="program-share-modal"]', function( elem ) {
        elem.preventDefault()
        var dataType = $(this).data('type')
        var newData

        switch (dataType) {
            case 'data1':
                newData = data1
                break;
            case 'data2':
                newData = data2
                break;
            default:
                newData = data2
        }

        animate(newData)
    })
}
