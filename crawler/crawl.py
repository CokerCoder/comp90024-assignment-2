import tweepy   
import json
import datetime
from tweepy.streaming import StreamListener

# matt uses key:
consumer_key = "WniU1K4CBvi9pSEgzGhr21rrA"   
consumer_secret = "VzBf6z8iXW81S4A5hSGotWdgZok6ezasrShvyWEEkZa5vteBZC"
access_token = "1384413537733283842-xUpen03JKhDouUumzADJI2jcES9F36"   
access_token_secret = "KPCt20qLZ44YVbtCsLJL0wBhNh2B2F0Xq3RAzeR7ccRs3"

# 创建认证对象 
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
auth.set_access_token(access_token, access_token_secret)   

# 传入auth参数，创建API对象 
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)   
# public_tweets = api.home_timeline()
# for tweet in public_tweets:
#     print (tweet.text)

#crawl by the loctaion from newest time (only one time, duplicate problem)
def crawl_by_loction():
    # q is the key word of text
    tweets = tweepy.Cursor(api.search, q='food', geocode="-37.999250,144.997395,57km", lang='en').items(5)    
    for tweet in tweets:
        print("Created_time: ", tweet.created_at)
        print("text: ", tweet.text)
        print("location: ", tweet.user.location)
        #print(tweet)

crawl_by_loction()

# crawl by time: 
# def crawl_by_time():
# tweets=tweepy.Cursor(api.search_full_archive,environment_name='**ENV NAME FROM API**', fromDate="202101010000", toDate="202103010000", geocode="-37.999250,144.997395,57km").items(2)
# tweets = tweepy.Cursor(api.search, q='#contentmarketing', count=20000, lang='en', since='2021-01-20').items(2)
# for tweet in tweets:
#     print("Created_time: ", tweet.created_at)
#     print("text: ", tweet.text)
#     print("location: ", tweet.user.location)
#     print(tweet)


# crawl by real time 
# def crawl_by_loction():
#   class MyStreamListener(tweepy.StreamListener):
#       def on_data(self, data):
#           # load data 
#           json_tweet = json.loads(data)
#           print(json_tweet)

# my_stream = tweepy.Stream(auth = auth, listener=MyStreamListener())
# # print(my_stream.running)
# my_stream.filter(locations=[144.293405,-38.548275,145.493112,-37.505479], languages="en",stall_warnings=True)
