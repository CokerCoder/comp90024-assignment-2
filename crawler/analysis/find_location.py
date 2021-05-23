"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

Location Helper Functions
"""




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
