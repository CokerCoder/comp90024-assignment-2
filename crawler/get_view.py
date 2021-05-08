import json
import nltk
import couchdb
from by_realtime.crawl_util import find_or_create_db
from view_creator import ViewCreator
from nltk.sentiment import SentimentIntensityAnalyzer
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

DATABASE = 'tweet_docs'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')
database = find_or_create_db(SERVER, "sentiment")

nltk.download('stopwords')
nltk.download('vader_lexicon')
view = ViewCreator(DATABASE, SERVER)

print(view.count_tweets())

LOCATION_POLYGON = json.load(open('melb.json'))["features"]

def find_location(coor):
    for suburb in LOCATION_POLYGON:
        if suburb['geometry']['type']=='Polygon':
            if Polygon(suburb["geometry"]["coordinates"][0]).contains(Point(coor)):
                return suburb['properties']["SA2_NAME16"]
        else:
            for subpolygon in suburb['geometry']['coordinates']:
                if Polygon(subpolygon[0]).contains(Point(coor)):
                    return suburb['properties']["SA2_NAME16"]
    return "None"

# count = 0
for doc in view.get_tweets():
    if doc.key not in database:
        #print(doc.value['Name'])
        # raw_words = [word.rstrip('!,?.\'\"').lower() for word in doc.value.split()]
        # stopwords = nltk.corpus.stopwords.words("english")
        # alpha_words = [w for w in raw_words if (w.isalpha() and w not in stopwords)]
        # print(alpha_words)
        coor = [(doc.value["Coordinates"][0][0]+doc.value["Coordinates"][2][0])/2,\
            (doc.value["Coordinates"][0][1]+doc.value["Coordinates"][1][1])/2]
        sia = SentimentIntensityAnalyzer()
        
        database.save({'_id': doc.key,
                        'location' :find_location(coor),
                        'sentiment': sia.polarity_scores(doc.value['Text'])
                        })