import json
import couchdb
from by_realtime.crawl_util import find_or_create_db

SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

network = json.load(open('network.json'))
sport = json.load(open('sport.json'))

def load_profile():   
    database = find_or_create_db(SERVER, "profile")
    profile = json.load(open('profile.json'))['features']
    for area in profile:
        doc = area['properties']
        doc['_id'] = doc['lga_name'].split()[0]
        try:
            database.save(doc)
        except:
            pass

def load_education():
    database = find_or_create_db(SERVER, "education")
    education = json.load(open('education.json'))

def load_sport():
    database = find_or_create_db(SERVER, "sport")
    sport = json.load(open('education.json'))

def load_network():
    database = find_or_create_db(SERVER, "network")
    network = json.load(open('education.json'))


    
if __name__ == '__main__':
    load_profile()