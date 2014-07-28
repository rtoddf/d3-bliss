var url = 'http://api.parsely.com/v2/analytics/posts?apikey=ajc.com&secret=lfH7gu08p8KmXxZgqlzTxpRqJEi17hwVLqPevTvYLWk&callback=?'

// HELPER FUNCTIONS
// check to see if date is an object or string
var isDateObject = function(date){
    return typeof(date) === 'object' && date === null ? date : new Date(date)
}

format = d3.time.format('%A, %B %d, %Y')

$.getJSON(url, function(response) {
	writeIt(response.data)
});

function writeIt(data){
	data.forEach(function(d, i){
		console.log(format(isDateObject(d.pub_date)))
	})
}