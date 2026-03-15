from pymongo import MongoClient
import datetime
import time
import json
import os

SLEEP_DURATION = 30 # seconds

def get_database():
    CONNECTION_STRING = os.environ.get('MONGO_URI')
    if not CONNECTION_STRING:
        raise ValueError("MONGO_URI environment variable is not set")
    client = MongoClient(CONNECTION_STRING)

    return client['graffiti']

def isDisplayEmpty():
    db = get_database()
    display_collection = db['displays']

    return display_collection.count_documents({}) == 0

def pull_and_display(queue_collection, display_collection):
    pipeline = [
        {'$sort': {'createdAt': -1}},
        {'$limit': 1}
    ]
    response = queue_collection.aggregate(pipeline)
    result = []
    for item in response:
        result.append(item)
    print(queue_collection.count_documents({}))
    if (len(result) > 0):
        result = result[0]
        result['createdAt'] = datetime.datetime.now()
        id = result['_id']
        display_collection.insert_one(result)
        queue_collection.delete_one({'_id': id})
    else:
        print('No images in queue')

def perform():
    db = get_database()
    queue_collection = db['imagequeues']
    display_collection = db['displays']
    if (isDisplayEmpty()):
        print('Display is empty: adding image')
        pull_and_display(queue_collection, display_collection)
    else:
        display_document = display_collection.find_one({})
        print('Current Display Item: ', display_document)
        created_at = display_document['createdAt']
        duration = display_document['duration']
        now = datetime.datetime.now()

        if (now - created_at).total_seconds() > duration * 60:
            print('Expired: Deleting from Display')
            display_collection.delete_one({})
            pull_and_display(queue_collection, display_collection)
if __name__ == "__main__":
    while True:
        print(f'Sleeping for {SLEEP_DURATION} seconds')
        time.sleep(SLEEP_DURATION)
        print(datetime.datetime.now())
        perform()
        print('Done\n')
