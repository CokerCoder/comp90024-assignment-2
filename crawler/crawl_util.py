import tweepy   
import json
import datetime
import couchdb
from tweepy.streaming import StreamListener
from datetime import date, timedelta


# read_from_db()
def read_from_db():
    db_doc = server['temp']
    for each_id in db_doc:
        print(db_doc[each_id])



# crawl by real time 
def crawl_by_real_time(database):
  class MyStreamListener(tweepy.StreamListener):
    def on_status(self, tweet):

            if has_location_info(tweet):
                json_tweet = json.dumps(create_dict_input(tweet))
            database.save({"doc":json_tweet})


# my_stream = tweepy.Stream(auth = auth, listener=MyStreamListener())
# my_stream.filter(locations=[144.293405,-38.548275,145.493112,-37.505479], languages="en",stall_warnings=True)


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


def find_or_creat_db(server,name):
    try:
        if name in server:
            database = server[name]
        else:
            database = server.create(name)
    except Exception as e:
        server.delete(name)
        database = server.create(name)
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




def crawl_by_loction_and_date(api,database,startDate,endDate):
    cricTweet = tweepy.Cursor(api.search, geocode="-37.999250,144.997395,57km", lang='en') 
    for tweet in cricTweet:
        if has_location_info(tweet) and tweet.created_at < endDate and tweet.created_at > startDate:
            json_tweet = json.dumps(create_dict_input(tweet))
            database.save({"doc":json_tweet})





# Creat Date Data
today = date.today()
def creat_date_file(today):
    datelist = [str(today - timedelta(days = i)) for i in range(50)]

    with open('date.txt', 'w') as filehandle:
        for date in datelist:
            filehandle.write('%s\n' % date)

    filehandle.close()


# Read the start and end date
def read_and_delete_first_date():

    with open('date.txt', 'r') as fin:
        data = fin.read().splitlines(True)
    with open('date.txt', 'w') as fout:
        end = data[0][:-1]+" 23:59:59"
        start = data[0][:-1]+ " 00:00:00"
        fout.writelines(data[1:])
        
    fout.close()
    return start,end

creat_date_file(today) 

