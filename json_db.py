import json
import couchdb

server = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

def find_or_create_db(server,name):
	try:
		if name in server:
			database = server[name]
		else:
			database = server.create(name)
	except Exception as e:
		database = server.create("new_"+name)
	return database

database = find_or_create_db(server,"test")
# change database name

# change json file name and path
with open("twitter.json", "r",encoding='utf-8') as file:
		for line in file.readlines():
				if line.startswith('{"id":"'):
						if line.endswith('},\n'):
							line = (line[:-2])
							tweet = json.loads(line)
						else:
							tweet = json.loads(line)


						if tweet["doc"]['place'] and tweet["doc"]['lang'] == "en":
							tweet = tweet["doc"]

							if str(tweet["id"]) not in database:
								 database.save({'_id':str(tweet["id"]),
								 'created_at': tweet['created_at'],
								 'text': tweet['text'],
								 "Place_name":tweet["place"]["name"],
								 "Place_full_name":tweet["place"]["full_name"],
								 "Place_country":tweet["place"]["country"],
								 "Place_coordinates":tweet["place"]["bounding_box"]['coordinates'][0]
								 })
			  
				
