import couchdb
import couchdb.design
from by_realtime.crawl_util import find_or_create_db


class ViewCreator(object):
	def __init__(self, dbname, server):
		self.server = server
		self.db = find_or_create_db(server, dbname)
		self._create_views()

	def _create_views(self):
		count_map = 'function(doc) { emit(doc.id, 1); }'
		count_reduce = 'function(keys, values) { return sum(values); }'
		view = couchdb.design.ViewDefinition('twitter', 'count_tweets', map_fun=count_map, reduce_fun=count_reduce)
		view.sync(self.db)

		get_tweets = 'function(doc) { emit(doc._id, {Text: doc.text, Name: doc.Place_full_name, Coordinates: doc.Place_coordinates}); }'
		view = couchdb.design.ViewDefinition('twitter', 'get_tweets', map_fun=get_tweets)
		view.sync(self.db)

		sentiment_map = 'function(doc) { emit(doc.name, doc.sentiment[\'compound\']); }'
		sentiment_reduce = """_stats"""
		view = couchdb.design.ViewDefinition('twitter', 'sentiment_count', map_fun=sentiment_map, reduce_fun=sentiment_reduce)
		view.sync(self.db)

	def save_tweet(self, tw):
		tw['_id'] = tw['id_str']
		self.db.save(tw)

	def count_tweets(self):
		for doc in self.db.view('twitter/count_tweets'):
			return doc.value

	def get_tweets(self):
		return self.db.view('twitter/get_tweets')
		
	def sentiment_count(self):
		for doc in self.db.view('twitter/sentiment_count'):
			return doc