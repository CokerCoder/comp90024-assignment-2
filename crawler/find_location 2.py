import json

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon



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
    return None


#####################################################################

DATABASE = 'tweet_docs'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

view = ViewCreator(DATABASE, SERVER)

locationlist = []


for doc in view.get_tweets():
    
    coor = [(doc.value["Coordinates"][0][0]+doc.value["Coordinates"][2][0])/2,(doc.value["Coordinates"][0][1]+doc.value["Coordinates"][1][1])/2]

    find_location(coor)
    ## Return 一个SA2的地区 or None，可以直接

    # database.save({'_id': doc.key,
    #                     'name': doc.value['Name'],
    #                     'coordinates': doc.value['Coordinates'],
    #                     'sentiment': sia.polarity_scores(doc.value['Text']),
    #                     'location' :find_location(coor)
    #                 })
    
