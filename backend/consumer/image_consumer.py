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

def isDisplayEmpty(db):
    display_collection = db['displays']
    return display_collection.count_documents({}) == 0

def pull_and_display(queue_collection, display_collection):
    # Socialist priority: FIFO (First-In-First-Out)
    # Get the OLDEST image in the queue
    pipeline = [
        {'$sort': {'createdAt': 1}},
        {'$limit': 1}
    ]
    response = queue_collection.aggregate(pipeline)
    result = []
    for item in response:
        result.append(item)
    
    if (len(result) > 0):
        result = result[0]
        # Set fresh createdAt for display tracking
        result['createdAt'] = datetime.datetime.now()
        id = result['_id']
        
        # Clear any existing displays just in case
        display_collection.delete_many({})
        
        # Insert current one
        display_collection.insert_one(result)
        
        # Remove from queue
        queue_collection.delete_one({'_id': id})
        print(f"Brought image {id} to display. Author: {result.get('author_name')}")
    else:
        print('No images in queue')

def perform():
    db = get_database()
    queue_collection = db['imagequeues']
    display_collection = db['displays']
    
    if (isDisplayEmpty(db)):
        print('Display is empty: adding image')
        pull_and_display(queue_collection, display_collection)
    else:
        display_document = display_collection.find_one({})
        if not display_document:
            return
            
        print('Current Display Item: ', display_document.get('author_name'), ' (ID:', display_document.get('_id'), ')')
        
        # Check if duration is present, default to 1 min
        duration = display_document.get('duration', 1)
        created_at = display_document.get('createdAt')
        
        if not created_at:
             # If someone messed up the record, just clear it
             display_collection.delete_many({})
             return

        now = datetime.datetime.now()
        elapsed = (now - created_at).total_seconds()
        
        if elapsed > duration * 60:
            print(f'Expired: Deleting from Display after {elapsed/60:.1f} minutes')
            display_collection.delete_many({})
            pull_and_display(queue_collection, display_collection)
        else:
            print(f'Active: { (duration*60 - elapsed)/60:.1f} minutes remaining')

if __name__ == "__main__":
    # Removed infinite loop to allow Cron to manage execution
    # This prevents multiple infinite-loop processes from stacking up
    print(f"Triggering Graffiti Consumer at {datetime.datetime.now()}")
    perform()
    print('Execution Completed')

