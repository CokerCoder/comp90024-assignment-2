"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

Crawling Helper Functions
"""

import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener
from datetime import date, timedelta


# read_from_db()
def read_from_db(server):
    db_doc = server['temp']
    for each_id in db_doc:
        print(db_doc[each_id])

# Create a database
def find_or_create_db(server,name):
    try:
        if name in server:
            database = server[name]
        else:
            database = server.create(name)
    except Exception as e:
        database = server.create("new_"+name)
    return database


def has_location_info(tweet):
    if tweet["place"]:
        return True
    return False


# crawl by the loctaion from newest time (only one time, duplicate problem)
def crawl_by_loction(api,database,n = 100,):
    cricTweet = tweepy.Cursor(api.search, geocode="-37.999250,144.997395,57km", lang='en').items(n)    
    for tweet in cricTweet:
        tweet = tweet._json
        if has_location_info(tweet) and str(tweet["id"]) not in database:
            database.save({'_id':str(tweet["id"]),
                        'created_at': tweet['created_at'],
                        'text': tweet['text'],
                        "Place_name":tweet["place"]["name"],
                        "Place_full_name":tweet["place"]["full_name"],
                        "Place_country":tweet["place"]["country"],
                        "Place_coordinates":tweet["place"]["bounding_box"]['coordinates'][0]
                        })


