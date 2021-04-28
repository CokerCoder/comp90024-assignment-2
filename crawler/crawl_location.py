import tweepy   
import json
from datetime import datetime
import couchdb
from tweepy.streaming import StreamListener

from crawl_util import find_or_creat_db,crawl_by_loction,read_and_delete_first_date,crawl_by_loction_and_date

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



# start, end = read_and_delete_first_date()
# start = datetime.strptime(start, '%Y-%m-%d %H:%M:%S')
# end = datetime.strptime(end, '%Y-%m-%d %H:%M:%S')


database = find_or_creat_db(server, 'temp')
crawl_by_loction(api,database,1000)

