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

# target database object
server = couchdb.Server('http://admin:admin@172.26.132.83:5984/')
try:
    database = server.create('temp')
except Exception as e:
    server.delete('temp')
    database = server.create('temp')

# To create the object 
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
auth.set_access_token(access_token, access_token_secret)   

# Pass the auth, to create API object 
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)   
public_tweets = api.home_timeline()
for tweet in public_tweets:
    print (tweet.text)

# crawl by the loctaion from newest time (only one time, duplicate problem)
def crawl_by_loction():
    cricTweet = tweepy.Cursor(api.search, geocode="-37.999250,144.997395,57km", lang='en').items(3)    
    for tweet in cricTweet:
        input_dict = {}
        input_dict['id_str'] = tweet.id_str
        input_dict['text'] = tweet.text
        input_dict['location'] = tweet.user.location
        input_dict['hashtags'] = tweet.entities['hashtags']
        print(input_dict)
        json_str = json.dumps(input_dict)
        database.save({"doc":json_str})
        # print(tweet)

crawl_by_loction();

def read_from_db():
    db_doc = server['temp']
    for each_id in db_doc:
        print(db_doc[each_id])

read_from_db()