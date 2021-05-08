import json

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon



Greater_Melbourne_POLYGON = json.load(open('Greater_Melbourne_LGA.json'))["features"]


def find_location(coor):
    if coor == [145.0531355, -37.9725665]:
        return None 
    for suburb in Greater_Melbourne_POLYGON:
        for subpolygon in suburb['geometry']['coordinates']:
            if Polygon(subpolygon[0]).contains(Point(coor)):
                return suburb['properties']["vic_lga__3"]
    return None


#####################################################################

DATABASE = 'tweet_docs'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

view = ViewCreator(DATABASE, SERVER)

locationlist = []


for doc in view.get_tweets():
    
    coor = [(doc.value["Coordinates"][0][0]+doc.value["Coordinates"][2][0])/2,(doc.value["Coordinates"][0][1]+doc.value["Coordinates"][1][1])/2]

    find_location(coor)
    ## Return 一个LGA, 已经清理了too genral的location

    # database.save({'_id': doc.key,
    #                     'name': doc.value['Name'],
    #                     'coordinates': doc.value['Coordinates'],
    #                     'sentiment': sia.polarity_scores(doc.value['Text']),
    #                     'location' :find_location(coor)
    #                 })
    
