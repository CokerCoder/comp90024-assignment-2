"""
COMP90024-Cluster and Cloud Computing Assignment 2
Team Group 26

Yunfei Jing (987784) jinyj@student.unimelb.edu.au
Tianze Liu (987969) tianze@student.unimelb.edu.au
Liang Min(981061) lmmin@student.unimelb.edu.au
Youran Zhou(991504) youran@student.unimelb.edu.au
Haoyuan Yu (988290) haoyuany@student.unimelb.edu.au

This file is used to Read Tweet data from provided Twitter Corpus and
stored into our Couch DB
"""



import json
import couchdb

server = couchdb.Server('http://admin:admin@172.26.132.83:5984/')


def find_or_create_db(server, name):
    try:
        if name in server:
            database = server[name]
        else:
            database = server.create(name)
    except Exception as e:
        database = server.create("new_" + name)
    return database


database = find_or_create_db(server, "all_docs_from_2018")

file_names = [
    "tweets2018_a.json",
    "tweets2018_b.json",
    "tweets2019.json",
    "tweets2020_a.json",
    "tweets2020_b.json",
    "tweets2021"
]

for file_name in file_names:
    with open(file_name, "r", encoding='utf-8') as file:

        print(f"parsing {file_name}...")

        while True:
            line = file.readline()
            if line.startswith("]}"):
                break

            if line.startswith('{"id":"'):
                if line.endswith('},\n'):
                    line = line[:-2]
                    tweet = json.loads(line)
                else:
                    break

                if "doc" in tweet:
                    if tweet["doc"]['place'] and tweet["doc"]['lang'] == "en" and tweet["doc"]["place"]["name"] != "Melbourne":
                        tweet = tweet["doc"]
                        if str(tweet["_id"]) not in database:
                            try:
                                database.save({'_id': str(tweet["_id"]),
                                               'created_at': tweet['created_at'],
                                               'text': tweet['text'],
                                               "Place_name": tweet["place"]["name"],
                                               "Place_full_name": tweet["place"]["full_name"],
                                               "Place_country": tweet["place"]["country"],
                                               "Place_coordinates": tweet["place"]["bounding_box"]['coordinates'][0]
                                               })
                            except:
                                print("save tweet failed, pass")
