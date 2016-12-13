import csv
import json

csvfile = open('../data/states_by_age.csv', 'r')
fieldnames = ("State", "Under 5 Years", "5 to 13 Years", "14 to 17 Years", "18 to 24 Years", "25 to 44 Years", "45 to 64 Years", "65 Years and Over")
reader = csv.DictReader( csvfile, fieldnames)

json_file = open('../data/states_by_age.json', 'w')

for row in reader:
    json_file.write(json.dumps(row, indent=4))

json_file.close()
