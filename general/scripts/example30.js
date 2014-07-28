(function () {
    var searchString = 'https://itunes.apple.com/us/rss/topsongs/limit=20/json'

    d3.json(searchString, function(error, data){
        var data = data.feed.entry

        var div = d3.select('#example').append('div')
            .attr({
                'class': 'results'
            })

        var result = div.selectAll('.result')
                .data(data)
            .enter().append('div')
            .attr({
                'class': 'result'
            })

        result.append('div')
            .attr({
                'class': 'image'
            })
            .append('img')
                .attr({
                    'src': function(d){
                        return d['im:image'][0].label
                    }
                })

        result.append('div')
            .attr({
                'class': 'artist'
            })
            .text(function(d){
                return d['im:artist'].label
            })

        result.append('p')
            .attr({
                'class': 'song_title'
            })
            .text(function(d){
                return d['im:name'].label
            })

        result.append('p')
            .attr({
                'class': 'genre'
            })
            .text(function(d){
                return d['category']['attributes'].label
            })

        result.append('div')
            .attr({
                'class': 'clear'
            })
    })
})()