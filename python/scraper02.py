import bs4
import json
import requests
from urllib import urlopen

data = {}
response = requests.get('http://boxofficemojo.com/yearly/chart/?yr=1985')
soup = bs4.BeautifulSoup(response.text)

tables = soup.find_all('table')
movie_table = tables[6]

rows = movie_table.find_all('tr')

for i, row in enumerate(rows):
	movie = {}
	cols = row.find_all('td')
	colspan = soup.find('td', attrs={'colpsan':'8'})
	if not colspan:
		# cols = [ele.text.strip() for ele in cols]
		# movie['rank'] = cols[0]
		# movie['title'] = cols[1]
		print 'cols: ', cols

# 	song['singer'] = cols[1]
# 	song['song'] = cols[2]
# 	data[i] = song
# 	# data.append([ele for ele in cols if ele])

# print data

# # songs = {song for song in data}

# 	# for i, col in enumerate(cols):
# 	# 	print col[i]
	

# json_file = open('scrape.json', 'w')
# json_file.write(json.dumps(data, indent=4))
# json_file.close()