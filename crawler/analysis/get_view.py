"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

Stored the processed Tweets
"""


import json
import nltk
import couchdb
from crawl_util import find_or_create_db
from view_creator import ViewCreator
from nltk.sentiment import SentimentIntensityAnalyzer
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from tqdm import tqdm

DATABASE = 'all_doc'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')
database = find_or_create_db(SERVER, "sentiment")

nltk.download('stopwords')
nltk.download('vader_lexicon')
view = ViewCreator(DATABASE, SERVER)
sia = SentimentIntensityAnalyzer()

print(view.count_tweets())

Greater_Melbourne_POLYGON = json.load(open('../data/Greater_Melbourne_LGA.json'))["features"]
def find_location(coor):
    if coor == [145.0531355, -37.9725665]:
        return None
    for suburb in Greater_Melbourne_POLYGON:
        for subpolygon in suburb['geometry']['coordinates']:
            if Polygon(subpolygon[0]).contains(Point(coor)):
                return suburb['properties']["vic_lga__3"]
    return None

for doc in tqdm(view.get_tweets()):

    coor = [(doc.value["Coordinates"][0][0]+doc.value["Coordinates"][2][0])/2,\
            (doc.value["Coordinates"][0][1]+doc.value["Coordinates"][1][1])/2]
            
    if find_location(coor) and doc.key not in database:
        database.save({'_id': doc.key,
                        'location' :find_location(coor),
                        'sentiment': sia.polarity_scores(doc.value['Text'])
                        })