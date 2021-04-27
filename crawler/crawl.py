import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener

# matt uses key:
consumer_key = "WniU1K4CBvi9pSEgzGhr21rrA"   
consumer_secret = "VzBf6z8iXW81S4A5hSGotWdgZok6ezasrShvyWEEkZa5vteBZC"
access_token = "1384413537733283842-xUpen03JKhDouUumzADJI2jcES9F36"   
access_token_secret = "KPCt20qLZ44YVbtCsLJL0wBhNh2B2F0Xq3RAzeR7ccRs3"

# To create the object 
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
auth.set_access_token(access_token, access_token_secret)   

# Pass the auth, to create API object 
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)  

# target database object
server = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

# Create a database
def create_database():
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
def crawl_by_loction():
    cricTweet = tweepy.Cursor(api.search, geocode="-37.999250,144.997395,57km", lang='en').items(100)    
    for tweet in cricTweet:
        if has_location_info(tweet):
            json_tweet = json.dumps(create_dict_input(tweet))
            database.save({"doc":json_tweet})

database = create_database()
crawl_by_loction()

def read_from_db():
    db_doc = server['temp']
    for each_id in db_doc:
        print(db_doc[each_id])

# read_from_db()

# crawl by real time 
def crawl_by_loction():
  class MyStreamListener(tweepy.StreamListener):
      def on_data(self, data):
          json_tweet = json.loads(data)
          database.save({ "doc": json_tweet})
          print(json_tweet)

# my_stream = tweepy.Stream(auth = auth, listener=MyStreamListener())
# my_stream.filter(locations=[144.293405,-38.548275,145.493112,-37.505479], languages="en",stall_warnings=True)