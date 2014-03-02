import json
import csv 

f = open('../data/test.json')
data = json.load(f)
f.close()

# f=csv.writer(open('test.csv','wb+'))
for item in data:
	print item[data.keys()[0]]
# 	for i in data[item]:
# 		print i
# 		print data[item]
# 		f.writerow( [i, data[item][i]] )