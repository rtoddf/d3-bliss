var sites = ['news965', 'wsbradio', 'wokv', 'krmg']

var prefix = 'http://api.chartbeat.com/live/toppages/v3/'
var options = '&limit=10&sortby=engaged_time'
var key = 'cfa46a3950a4f0cda65b530b5cf05bf5'

var news965_url = prefix + '?host=news965.com' + options + '&apikey=' + key
var wsbradio_url = prefix + '?host=wsbradio.com' + options + '&apikey=' + key
var wokv_url = prefix + '?host=wokv.com' + options + '&apikey=' + key
var krmg_url = prefix + '?host=krmg.com' + options + '&apikey=' + key

var barHeight = 40

var y = d3.scale.ordinal()
    .rangeRoundBands([ 0, height], .1)

// var url1 = http://api.chartbeat.com/live/toppages/v3/?host=ajc.com&limit=10&sortby=engaged_time&apikey=cfa46a3950a4f0cda65b530b5cf05bf5

var the_whole_thing = []

var container_parent = $('.display') ,
    chart_container = $('#stuff'),
    margins = {top: 0, right: 20, bottom: 20, left: 0},
    width = container_parent.width(),
    height = 40 * barHeight,
    vis, vis_group, aspect

vis = d3.select('#stuff').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'class': 'chart',
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
    .attr({
        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
    })

aspect = chart_container.width() / chart_container.height()

    // .awaitAll(ready)
queue()
    .defer(d3.json, news965_url)
    .defer(d3.json, wsbradio_url)
    .defer(d3.json, wokv_url)
    .defer(d3.json, krmg_url)
    .await(ready);

function ready(error, news965, wsbradio, wokv, krmg) {
    news965.pages.forEach(function(d){
        d.site = 'news965'
        the_whole_thing.push(d)
    })

    wsbradio.pages.forEach(function(d){
        d.site = 'wsbradio'
        the_whole_thing.push(d)
    })

    wokv.pages.forEach(function(d){
        d.site = 'wokv'
        the_whole_thing.push(d)
    })

    krmg.pages.forEach(function(d){
        d.site = 'krmg'
        the_whole_thing.push(d)
    })

    chartit(the_whole_thing)
}

function chartit(data){
    console.log('data: ', data)

    y.domain(data.sort(function(a, b) {
        return d3.descending(a.stats.visits, b.stats.visits);
    })
    .map(function(d) {
        return d.stats.visits;
    }))

    var bar = vis_group.selectAll('g')
            .data(data)
        .enter().append('g')
            .attr({
                // 'class': 'bar',
                'transform': function(d, i) {
                    console.log('d: ', d.stats)
                    return 'translate(0,' +  i * 40 + ')'
                }
            })

    bar.append('rect')
        .attr({
            'class': function(d){
                return 'bar ' + d.site
            },
            'x': 0,
            // 'y': function(d){
            //     return y(d.stats.visits)
            // },
            'width': width,
            'height': barHeight
        })

    bar.append('text')
        .attr({
            'x': 20,
            'y': barHeight / 2,
            'dy': '.35em',
            'font-size': 18,
            'fill': 'white'
        })
        .text(function(d) {
            return d.stats.visits
        })

    bar.append('text')
        .attr({
            'x': 80,
            'y': barHeight / 2,
            'dy': '.35em',
            'font-size': 18,
            'fill': '#fff'
        })
        .text(function(d) {
            return d.title
        })

    bar.append('text')
        .attr({
            'x': width - 80,
            'y': barHeight / 2,
            'dy': '.35em',
            'font-size': 18,
            'fill': '#fff'
        })
        .text(function(d) {
            return d.stats.engaged_time.avg
        })

    $('button').on('click', function(){
        var sort = $(this).data('sort')
        d3.select(this)
            .property('sort', sort)
            .each(change)
    })

    function change() {
        if(this.sort == 'desc'){
            var y0 = y.domain(data.sort(function(a, b) {
                console.log('a.stats.visits: ', a.stats.visits)
                return d3.descending(a.stats.visits, b.stats.visits);
            })
            .map(function(d) {
                return d.stats.visits;
            }))
            .copy()
        } else if(this.sort == 'asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.stats.visits, b.stats.visits);
            })
            .map(function(d) {
                return d.stats.visits;
            }))
            .copy()
        }

        var transition = vis_group.transition().duration(750),
            delay = function(d, i) {
                return i * 30;
            };

        transition.selectAll('.bar')
            .delay(delay)
            .ease('cubic')
            .attr('y', function(d) {
                console.log('y0(d.stats.visits): ', y0(d.stats.visits))
                return y0(d.stats.visits);
            });
    }

}
