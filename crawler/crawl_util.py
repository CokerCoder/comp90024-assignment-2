import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener


# read_from_db()
def read_from_db():
    db_doc = server['temp']
    for each_id in db_doc:
        print(db_doc[each_id])


# Create a database
def create_database(server):
    try:
        if 'temp' in server:
            database = server['temp']
        else:
            database = server.create('temp')
    except Exception as e:
        server.delete('temp')
        database = server.create('temp')
    return database


# create a dictionary contains information that we need
def create_dict_input(tweet):
    tweet = tweet._json
    info_dict = {}
    info_dict['created_at'] = tweet['created_at']
    info_dict['id_str'] = tweet['id_str']
    info_dict['text'] = tweet['text']
    info_dict['place'] = tweet['place']
    return info_dict

def has_location_info(tweet):
    if tweet.place:
        return True
    return False

# crawl by the loctaion from newest time (only one time, duplicate problem)
def crawl_by_loction(api,database,n = 100,):
    cricTweet = tweepy.Cursor(api.search, geocode="-37.999250,144.997395,57km", lang='en').items(n)    
    for tweet in cricTweet:
        if has_location_info(tweet):
            json_tweet = json.dumps(create_dict_input(tweet))
            database.save({"doc":json_tweet})