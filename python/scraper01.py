import bs4
import json
import requests
from urllib import urlopen

data = {}
response = requests.get('http://www.bobborst.com/popculture/top-100-songs-of-the-year/?year=1981')
soup = bs4.BeautifulSoup(response.text)

table = soup.find('table', attrs={'class':'songtable'})
table_body = table.find('tbody')

rows = table_body.find_all('tr')

for i, row in enumerate(rows):
	song = {}
	cols = row.find_all('td')
	cols = [ele.text.strip() for ele in cols]
	song['rank'] = cols[0]
	song['singer'] = cols[1]
	song['song'] = cols[2]
	data[i] = song
	# data.append([ele for ele in cols if ele])

print data

# songs = {song for song in data}

	# for i, col in enumerate(cols):
	# 	print col[i]
	

json_file = open('scrape.json', 'w')
json_file.write(json.dumps(data, indent=4))
json_file.close()