function groupMentionsBySpeaker(mentions) {
  return d3.nest()
	  .key(function(d) { 
		return d.name
	  })
	  // .rollup(collapseMentions)
	  .entries(mentions);
}

var width = 600,
	height = 500

d3.json('../data/speakers.json', function(error, data){
	var speakers = groupMentionsBySpeaker(data)

	speakers.forEach(function(d){
		var speakerName = d.values[0].name
		var speakerTitle = d.values[0].title

		var div = d3.select('.g-body').append('div')
			.attr({
				'class': 'g-mention'
			})

		div.append('div')
			.attr({
				'class': 'g-speaker'
			})
			.text(speakerName)

		div.append('div')
			.attr({
				'class': 'g-speaker-title'
			})
			.text(speakerTitle ? speakerTitle : '');
	})		
})