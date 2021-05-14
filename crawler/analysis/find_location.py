import json

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon


Greater_Melbourne_POLYGON = json.load(open('../data/Greater_Melbourne_LGA.json'))["features"]


def find_location(coor):
    if coor == [145.0531355, -37.9725665]:
        return None 
    for suburb in Greater_Melbourne_POLYGON:
        for subpolygon in suburb['geometry']['coordinates']:
            if Polygon(subpolygon[0]).contains(Point(coor)):
                return suburb['properties']["vic_lga__3"]
    return None
