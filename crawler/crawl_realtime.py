import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener

from crawl_util import create_database,crawl_by_loction

# matt uses key:
consumer_key = "IiP6IJaXPBydO5TIlJDsHVkw4"   
consumer_secret = "5cabZq4WiCBC3ZnTlX5wBbIvskX5rmGXy1iftkUhwRE4zBRyxw"   
access_token = "1017762893570306048-dQOTxnvRbK0YVbD2oQZA3wvujIGdse"   
access_token_secret = "LqPOLBKcdWniK6V5jSdUykv2AH2eM0TVCeKMQ8t8fzQh4"   

# To create the object 
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
auth.set_access_token(access_token, access_token_secret)   

# Pass the auth, to create API object 
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)  

# target database object
server = couchdb.Server('http://admin:admin@172.26.132.83:5984/')


class MyStreamListener(tweepy.StreamListener):
    def on_status(self, tweet):

        if has_location_info(tweet):
            json_tweet = json.dumps(create_dict_input(tweet))
            database.save({"doc":json_tweet})
            print("Storing one tweet...")


database = create_database(server)


Listener = MyStreamListener()
myStream = tweepy.Stream(auth = auth,listener=Listener)
myStream.filter(locations=[144.293405,-38.548275,145.493112,-37.505479],languages='en')




