"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

AURIN Data Preprocessing 
"""


import json
import couchdb
from crawl_util import find_or_create_db
from collections import defaultdict
from find_location import find_location
from tqdm import tqdm

SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

LGA = ['KINGSTON','FRANKSTON','DAREBIN','MAROONDAH','MARIBYRNONG','HOBSONS BAY','MANNINGHAM',
'WHITEHORSE','BOROONDARA','KNOX','MONASH','YARRA','STONNINGTON','MORELAND','MOONEE VALLEY','WYNDHAM',
'MELTON','HUME','WHITTLESEA','BRIMBANK','YARRA RANGES','CARDINIA','MITCHELL','CASEY','NILLUMBIK',
 'GLEN EIRA','GREATER DANDENONG','BAYSIDE','MELBOURNE','PORT PHILLIP','BANYULE','MORNINGTON PENINSULA']

def load_profile():  
    all_lga = []
    Greater_Melbourne_POLYGON = json.load(open('../data/Greater_Melbourne_LGA.json'))["features"]
    for suburb in Greater_Melbourne_POLYGON:
        all_lga.append(suburb['properties']["vic_lga__3"])
    database = find_or_create_db(SERVER, "profile")
    profile = json.load(open('../data/profile.json'))['features']
    for area in profile:
        doc = area['properties']
        name = ' '.join(doc['lga_name'].split()[:-1]).upper()
        if name in all_lga:
            try:
                doc['_id'] = name
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


def load_transports():
    database = find_or_create_db(SERVER, "transports")


    bus = json.load(open('../data/Metro_Bus_Stops.json'))
    train = json.load(open('../data/Metro_Train_Stations.json'))
    tram = json.load(open('../data/Metro_Tram_Stops.json'))
    sky_bus = json.load(open('../data/SkyBus_Stops.json'))
    night_bus = json.load(open('../data/Night_Bus_Stops.json'))

    transports_bus = defaultdict(lambda:0)
    for i in tqdm(bus["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            transports_bus[lga] += 1

    
    transports_train = defaultdict(lambda:0)
    for i in tqdm(train["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            transports_train[lga] += 1


    transports_tram = defaultdict(lambda:0)
    for i in tqdm(tram["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            transports_tram[lga] += 1
    


    transports_sky_bus = defaultdict(lambda:0)
    for i in tqdm(sky_bus["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            transports_sky_bus[lga] += 1




    transports_night_bus = defaultdict(lambda:0)
    for i in tqdm(night_bus["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            transports_night_bus[lga] += 1



    for i in LGA:
        try:
            database.save({"_id":i,
                            "transports_bus":transports_bus[i],
                            "transports_train":transports_train[i],
                            "transports_tram":transports_tram[i],
                            "transports_sky_bus":transports_sky_bus[i],
                            "transports_night_bus":transports_night_bus[i] })
        except:
            pass


def load_education_School():
    database = find_or_create_db(SERVER, "education_school")
    education = json.load(open('../data/School_Locations.json'))

    Schooldic = defaultdict(lambda:0)
    for i in tqdm(education["features"]):
        coor = [i["geometry"]["coordinates"][0][0],i["geometry"]["coordinates"][0][1]]
        lga = find_location(coor)
        if lga:
            Schooldic[lga] += 1



    for i in Schooldic:
        try:
            database.save({"_id":i,
                            "School":Schooldic[i] })
        except:
            pass

def load_national_hospital():
    database = find_or_create_db(SERVER, "national_hospital")
    hospital = json.load(open('../data/National_Hospital.json'))

    hospitaldic = defaultdict(lambda:0)
    for i in tqdm(hospital["features"]):
        if i["properties"]["state"] == "VIC":
            coor = [i["properties"]["longitude"],i["properties"]["latitude"]]
            lga = find_location(coor)
            if lga:
                hospitaldic[lga] += 1

    for i in hospitaldic:
        try:
            database.save({"_id":i,
                            "National Hospital":hospitaldic[i] })
        except:
            pass


def load_entertainment():
    database = find_or_create_db(SERVER, "entertainment")


    gambling = json.load(open('../data/Gambling_Venues.json'))
    wagering = json.load(open('../data/Keno_and_Wagering_Venues.json'))
    liquor = json.load(open('../data/Liquor_Venues.json'))


    entertainment_gambling = defaultdict(lambda:0)
    for i in tqdm(gambling["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            entertainment_gambling[lga] += 1

    
    entertainment_wagering = defaultdict(lambda:0)
    for i in tqdm(wagering["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            entertainment_wagering[lga] += 1


    entertainment_liquor = defaultdict(lambda:0)
    for i in tqdm(liquor["features"]):
        lga = find_location(i["geometry"]["coordinates"])
        if lga:
            entertainment_liquor[lga] += 1
    

    for i in LGA:
        try:
            database.save({"_id":i,
                            "entertainment_gambling":entertainment_gambling[i],
                            "entertainment_wagering":entertainment_wagering[i],
                            "entertainment_liquor":entertainment_liquor[i]})
        except:
            pass

def load_population():
    database = find_or_create_db(SERVER, "estimated_population")
    data = json.load(open('../data/estimated_population.json'))

    collected = []
    for i in data["features"]:
        name = " ".join(i['properties']["lga_name"].split()[:-1]).upper() 
        if name in LGA:
            collected.append([name,i['properties']["tpop_2021"],i['properties']["tpop_2020"],i['properties']["tpop_2019"],
                          i['properties']["tpop_2018"],i['properties']["tpop_2017"],i['properties']["tpop_2016"],
                           i['properties']["tpop_2015"],i['properties']["tpop_2014"],i['properties']["tpop_2013"],
                           i['properties']["tpop_2012"],i['properties']["tpop_2011"]])



    for i in collected:
        try:
            database.save({"_id":i[0],
                            "tpop_2021":i[1],
                            "tpop_2020":i[2],
                            "tpop_2019":i[3],
                            "tpop_2018":i[4],
                            "tpop_2017":i[5],
                            "tpop_2016":i[6],
                            "tpop_2015":i[7],
                            "tpop_2014":i[8],
                            "tpop_2013":i[9],
                            "tpop_2012":i[10],
                            "tpop_2011":i[11]})
        except:
            pass

    
if __name__ == '__main__':
    load_profile()
    load_education_TAFE()
    load_education_UNI()
    load_sport()
    load_transports()
    load_education_School()
    load_national_hospital()
    load_entertainment()
    load_population()