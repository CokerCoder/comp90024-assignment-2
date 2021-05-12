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

for doc in view.get_sentiment():
    # if doc.key not in database:
        #print(doc.value['Name'])
        # raw_words = [word.rstrip('!,?.\'\"').lower() for word in doc.value.split()]
        # stopwords = nltk.corpus.stopwords.words("english")
        # alpha_words = [w for w in raw_words if (w.isalpha() and w not in stopwords)]
        # print(alpha_words)
    location = doc.value['Location']
    sentiment = doc.value['Sentiment']['compound']
    count_dict[location] += 1
    average_dict[location].append(sentiment)

for location in count_dict.keys():
    sentiment_list = average_dict[location]
    count = count_dict[location]
    average = sum(sentiment_list)/len(sentiment_list)
    try:
        doc = database[location]
    except:
        database.save({'_id': location,
                        'count': count,
                        'average': average
                        })
    else:
        doc['count'] = count
        doc['average'] = average
        database[location] = doc