var url1 = 'http://api.chartbeat.com/live/toppages/?host=news965.com&limit=10&apikey=cfa46a3950a4f0cda65b530b5cf05bf5'
var url2 = 'http://api.chartbeat.com/live/toppages/?host=wsbradio.com&limit=10&apikey=cfa46a3950a4f0cda65b530b5cf05bf5'
var url3 = 'http://api.chartbeat.com/live/toppages/?host=wokv.com&limit=10&apikey=cfa46a3950a4f0cda65b530b5cf05bf5'
var url4 = 'http://api.chartbeat.com/live/toppages/?host=krmg.com&limit=10&apikey=cfa46a3950a4f0cda65b530b5cf05bf5'

// var url1 = 'http://api.chartbeat.com/live/toppages/?host=any&limit=10&apikey=cfa46a3950a4f0cda65b530b5cf05bf5'

var the_whole_thing = []

    // .defer(d3.json, url1)
    // .defer(d3.json, url2)
    // .defer(d3.json, url3)
    // .defer(d3.json, url4)
    // .awaitAll(ready)
queue()
    .defer(d3.json, url1)
    .defer(d3.json, url2)
    .defer(d3.json, url3)
    .defer(d3.json, url4)
    .awaitAll(ready);

function ready(error, data) {
    console.log('data: ', data)
    // console.log('news: ', news)
    // console.log('wsb: ', wsb)
    // console.log('wokv: ', wokv)
    // console.log('krmg: ', krmg)

    data.forEach(function(d){
        // console.log('d: ', d)
        d.forEach(function(t){
            // console.log('t: ', t)

            the_whole_thing.push(t)

        })
    })

    the_whole_thing.sort(function(a, b) {
        return d3.descending(a.visitors, b.visitors)
    })

    console.log('the_whole_thing: ', the_whole_thing)

    var template_compiled = _.template(template_raw, {
        data: the_whole_thing
    })
    $('#stuff').html(template_compiled)

}

var template_raw = '<table> \
    <% for(var i=0; i < data.length; i++){ %> \
        <tr> \
            <td><%= data[i].i %></td> \
            <td><%= data[i].path %></td> \
            <td><%= data[i].visitors %></td> \
        </tr> \
    <% } %> \
</table>'
















