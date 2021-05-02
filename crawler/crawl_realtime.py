import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener

import crawl_util

# Echo uses key:
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
        print("Find 1 tweet...")

        tweet = tweet._json
        if crawl_util.has_location_info(tweet):

            print("Storing 1 tweet...")
            #print(json_tweet)
            #database.save({"doc":json_tweet})
            if str(tweet["id"]) not in database:
                database.save({'_id':str(tweet["id"]),
                           'created_at': tweet['created_at'],
                           'text': tweet['text'],
                            "Place_name":tweet["place"]["name"],
                            "Place_full_name":tweet["place"]["full_name"],
                            "Place_country":tweet["place"]["country"],
                            "Place_coordinates":tweet["place"]["bounding_box"]['coordinates'][0]
                           })

    def on_error(self, status_code):
        print(status_code)

        if status_code == 429:
            time.sleep(15*60 + 1)
        else: 
            time.sleep(10)


print("Connect to Server...")
#database = create_database(server)
#database = crawl_util.find_or_create_db(server,"tweet_docs")
database = crawl_util.find_or_create_db(server,"tweet_docs_instance")


Listener = MyStreamListener()
print("Set Listener...")
myStream = tweepy.Stream(auth = auth,listener=Listener)
print("Start Stream...")
myStream.filter(locations=[144.293405,-38.548275,145.493112,-37.505479])

print(myStream.running)

