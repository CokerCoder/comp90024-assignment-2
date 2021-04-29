import couchdb
from view_creator import ViewCreator

DATABASE = 'animals'
SERVER = couchdb.Server('http://admin:admin@172.26.132.83:5984/')

if __name__ == '__main__':

    view = ViewCreator(DATABASE, SERVER)

    print('tweet count is %d' % view.count_tweets())

    for doc in view.get_tweets():
        print('%s' % doc.value)