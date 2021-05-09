import json
import couchdb
from by_realtime.crawl_util import find_or_create_db
from collections import defaultdict
from find_location import find_location
from tqdm import tqdm

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

def load_education_TAFE():
    database = find_or_create_db(SERVER, "education_tafe")
    education = json.load(open('data/education-TAFE.json'))
    TAFEdic = defaultdict(lambda:0)
    for i in education["features"]:
        if i["properties"]["state"] == "VIC":
            coor = [i["properties"]["longitude"],i["properties"]["latitude"]]
            lga = find_location(coor)
            if lga:
                TAFEdic[lga] += 1

    for i in TAFEdic:
        database.save({"_id":i,
                    "TAFE":TAFEdic[i] })


def load_education_UNI():
    database = find_or_create_db(SERVER, "education_uni")
    education = json.load(open('data/education-UNI.json'))
    UNIdic = defaultdict(lambda:0)
    for i in education["features"]:
        if i["properties"]["state"] == "VIC":
            coor = [i["properties"]["longitude"],i["properties"]["latitude"]]
            lga = find_location(coor)
            if lga:
                UNIdic[lga] += 1

    for i in UNIdic:
        database.save({"_id":i,
                    "UNI":UNIdic[i] })

def load_sport():
    database = find_or_create_db(SERVER, "sport")
    sport = json.load(open('data/sport.json'))
    sportdic = defaultdict(lambda:0)
    for i in tqdm(sport["features"]):
        location = find_location(i["geometry"]["coordinates"])
        if location:
            sportdic[location] += 1

    for i in sportdic:
        database.save({"_id":i,
                 "SPORT":sportdic[i] })

def load_network():
    database = find_or_create_db(SERVER, "network")
    network = json.load(open('education.json'))


    
if __name__ == '__main__':
    load_profile()