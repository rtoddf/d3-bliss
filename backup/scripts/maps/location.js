var thisMarket = getTokens(),
	states = [],
	stateCode,
	media_types = ['television', 'radio', 'digital', 'newspaper', 'directmail']

$(document).ready(function(){
    getMarketData()
});

function getMarketData(){
    $.getJSON('../data/markets.json', function(data){
    	
    	var properties = []
        $.each(data, function(key, val){
        	states.push(val.name)
            $.each(val.properties, function(k, v){
            	if(v.name == thisMarket){
            		stateCode = v.code
            		$.each(media_types, function(i, type){
            			if(v[type].length !== 0){
            				$.each(v[type], function(j, d){
	                            properties.push(d)
	                        })
            			}
            		})
            	}
            })
        })
        
        makeCards(properties)
    })
}

function makeCards(properties){
	var template_card_compiled = _.template(template_card_raw, {
		data: properties
	})

	var propertImage = thisMarket.replace(' ', '')

	$('#property').html(thisMarket + ', ' + stateCode)
	$('#property-image').attr('src', '../images/locations/' + propertImage + '.jpg')
	$('#cities').html(template_card_compiled)
}

var template_card_raw = '<% for (var i = 0; i < data.length; i++){ %> \
	<div class="col-sm-6 col-md-4"> \
		<div class="market-card"> \
			<a href="<%= data[i].link %>" target="_blank"><img src="../images/locations/<%= data[i].image %>"></a> \
			<p class="market-card-title"><a href="<%= data[i].link %>" target="_blank"><%= data[i].name %></a></p> \
			<p class="market-card-label">Format:</p> \
			<p class="market-card-type">THIS, Website</p> \
			<p class="market-card-format"><%= data[i].format %></p> \
			<% if(data[i].affiliate !== ""){ %> \
				<p class="market-card-label">Affiliate:</p> \
				<p><%= data[i].affiliate %></p> \
			<% } %> \
			<p class="market-card-label">Market:</p> \
			<p><%= data[i].market %></p> \
			<% if(data[i].frequency !== ""){ %> \
				<p class="market-card-label">Frequency:</p> \
				<p><%= data[i].frequency %></p> \
			<% } %> \
			<ul class="list-unstyled"> \
				<li><a href="javascript:void(0)">Contact Us</a></li> \
				<li><a href="javascript:void(0)">Advertise With Us</a></li> \
				<li><a href="<%= data[i].link %>" target="_blank">Website</a></li> \
			</ul> \
		</div> \
	</div> \
<% } %>'

function getTokens(){
    var tokens = [];
    var query = location.search
    query = query.slice(1);
    query = query.split('&');

    // this is ugly - find another way
    if(query[0] == 'sanantonio'){
    	return 'san antonio';
    } else if(query[0] == 'palmbeach') {
    	return 'palm beach';
    } else if(query[0] == 'longisland') {
    	return 'long island';
    } else if(query[0] == 'sanfrancisco') {
    	return 'san francisco';
    } else {
    	return query[0]
    }
}
