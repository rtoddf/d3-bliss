import json

json_data = open('../data/test.json')
data = json.load(json_data)
json_data.close()

matrix = []

for line in data:
	list_line = []
	for i in data[line]:
		list_line.append(data[line][i])
	matrix.append(list_line)

print matrix