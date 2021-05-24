"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

The Location Tweets harvester 
"""



import tweepy   
import json
from datetime import datetime
import couchdb
from tweepy.streaming import StreamListener

import crawl_util

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

database = crawl_util.find_or_create_db(server, 'tweet_docs_location')
crawl_util.crawl_by_loction(api,database,4300000)