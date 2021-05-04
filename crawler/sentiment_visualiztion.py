import json
import couchdb
from view_creator import ViewCreator
from by_realtime.crawl_util import find_or_create_db

DATABASE = 'sentiment'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')
database = find_or_create_db(SERVER, "sentiment")

view = ViewCreator(DATABASE, SERVER)
print(view.sentiment_count())