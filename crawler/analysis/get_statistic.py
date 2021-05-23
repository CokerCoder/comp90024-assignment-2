"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

Sentiment analysis for Tweets  
"""



import json
import couchdb
from crawl_util import find_or_create_db
from view_creator import ViewCreator
from collections import defaultdict

DATABASE = 'sentiment'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')
database = find_or_create_db(SERVER, "statistic")
view = ViewCreator(DATABASE, SERVER)

print(view.count_tweets())

count_dict = defaultdict(int)
average_dict = defaultdict(list)
positive_dict = defaultdict(int)
negative_dict = defaultdict(int)
neutral_dict = defaultdict(int)

for doc in view.get_sentiment():
    # if doc.key not in database:
        #print(doc.value['Name'])
        # raw_words = [word.rstrip('!,?.\'\"').lower() for word in doc.value.split()]
        # stopwords = nltk.corpus.stopwords.words("english")
        # alpha_words = [w for w in raw_words if (w.isalpha() and w not in stopwords)]
        # print(alpha_words)
    location = doc.value['Location']
    sentiment = doc.value['Sentiment']['compound']
    if sentiment > 0:
        positive_dict[location] += 1
    elif sentiment == 0:
        neutral_dict[location] += 1
    else:
        negative_dict[location] += 1
    count_dict[location] += 1
    average_dict[location].append(sentiment)
    
for location in count_dict.keys():
    sentiment_list = average_dict[location]
    count = count_dict[location]
    average = sum(sentiment_list)/len(sentiment_list)
    positive = positive_dict[location]
    negative = negative_dict[location]
    neutral = neutral_dict[location]
    try:
        doc = database[location]
    except:
        database.save({'_id': location,
                        'count': count,
                        'average': average,
                        'positive': positive,
                        'negative': negative,
                        'neutral': neutral
                        })
    else:
        doc['count'] = count
        doc['average'] = average
        doc['positive'] = positive
        doc['negative'] = negative
        doc['neutral'] =  neutral
        database[location] = doc