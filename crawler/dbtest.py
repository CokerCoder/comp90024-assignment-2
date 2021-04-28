import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener

from crawl_util import create_database,crawl_by_loction,has_location_info,create_dict_input,find_or_creat_db

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


database = find_or_creat_db(server,"test")


# public_tweets = api.home_timeline() 

# for tweet in public_tweets[:5]:     
 
#     print(tweet.text) 



doc_id, doc_rev = database.save({'_id':"test",'type': 'Person', 'name': 'John Doe'})
doc = database[doc_id]
print(doc)

