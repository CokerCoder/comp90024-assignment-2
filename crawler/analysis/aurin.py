import json
import couchdb
from crawl_util import find_or_create_db
from collections import defaultdict
from find_location import find_location
from tqdm import tqdm

SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

def load_profile():   
    database = find_or_create_db(SERVER, "profile")
    profile = json.load(open('../data/profile.json'))['features']
    for area in profile:
        doc = area['properties']
        doc['_id'] = ' '.join(doc['lga_name'].split()[:-1]).upper()
        try:
            database.save(doc)
        except:
            pass

def load_education_TAFE():
    database = find_or_create_db(SERVER, "education_tafe")
    education = json.load(open('../data/education-TAFE.json'))
    TAFEdic = defaultdict(lambda:0)
    for i in education["features"]:
        if i["properties"]["state"] == "VIC":
            coor = [i["properties"]["longitude"],i["properties"]["latitude"]]
            lga = find_location(coor)
            if lga:
                TAFEdic[lga] += 1

    for i in TAFEdic:
        try:
            database.save({"_id":i,
                            "TAFE":TAFEdic[i] })
        except:
            pass

def load_education_UNI():
    database = find_or_create_db(SERVER, "education_uni")
    education = json.load(open('../data/education-UNI.json'))
    UNIdic = defaultdict(lambda:0)
    for i in education["features"]:
        if i["properties"]["state"] == "VIC":
            coor = [i["properties"]["longitude"],i["properties"]["latitude"]]
            lga = find_location(coor)
            if lga:
                UNIdic[lga] += 1

    for i in UNIdic:
        try:
            database.save({"_id":i,
                            "UNI":UNIdic[i] })
        except:
            pass

def load_sport():
    database = find_or_create_db(SERVER, "sport")
    sport = json.load(open('../data/sport.json'))
    sportdic = defaultdict(lambda:0)
    for i in tqdm(sport["features"]):
        location = find_location(i["geometry"]["coordinates"])
        if location:
            sportdic[location] += 1

    for i in sportdic:
        try:
            database.save({"_id":i,
                           "SPORT":sportdic[i] })
        except:
            pass

    
if __name__ == '__main__':
    load_profile()
    load_education_TAFE()
    load_education_UNI()
    load_sport()