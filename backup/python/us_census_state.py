import json
import json as simplejson
from urllib import urlopen
import time
from pprint import pprint

api = 'census/'
sumlevid = 2
apiKey = 'gaxuakuw5p6yny37xmcrwmut'

def get_census_data(keypat):
	feed_url = 'http://api.usatoday.com/open/' + api + 'pop?keypat=' + keypat + '&sumlevid=' + str(sumlevid) + '&api_key=' + apiKey
	api_data = simplejson.loads(urlopen(feed_url).read())
	return api_data['response'][0]

with open('../data/states.json', 'r') as state_file:
	states_data = json.load(state_file)

census = []

for state in states_data:
	census_data = get_census_data(state['value'])
	race_data = {}

	for key, val in census_data.items():
		race_data['placename'] = census_data['Placename']
		race_data['statepostal'] = census_data['StatePostal']
		race_data['pop'] = float(census_data['Pop'])
		race_data['popSqmi'] = float(census_data['PopSqMi'])
		race_data['fips'] = census_data['FIPS']
		race_data['pctchange'] = float(census_data['PctChange'])

	census.append(race_data)

	print 'processing ' + state['value']

	time.sleep(5)

with open('../data/us_census.json', 'w') as json_file:
	json.dump(census, json_file, indent=4)