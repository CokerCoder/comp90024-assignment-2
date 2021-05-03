import json
import nltk
import couchdb
import crawl_util
from view_creator import ViewCreator
from nltk.sentiment import SentimentIntensityAnalyzer

DATABASE = 'tweet_docs_instance'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')
database = crawl_util.find_or_create_db(SERVER, "sentiment")

nltk.download('stopwords')
nltk.download('vader_lexicon')
view = ViewCreator(DATABASE, SERVER)

print(view.count_tweets())

# count = 0
for doc in view.get_tweets():
    if doc.key not in database:

        # raw_words = [word.rstrip('!,?.\'\"').lower() for word in doc.value.split()]
        # stopwords = nltk.corpus.stopwords.words("english")
        # alpha_words = [w for w in raw_words if (w.isalpha() and w not in stopwords)]
        # print(alpha_words)

        sia = SentimentIntensityAnalyzer()
        
        database.save({'_id':doc.key,
                        'sentiment': sia.polarity_scores(doc.value)
                    })