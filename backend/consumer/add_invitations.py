from pymongo import MongoClient
import datetime
import time
import json
import random
import string
import sys

# SLEEP_DURATION = 1 # seconds
SIZE = 6

def get_database():
    CONNECTION_STRING = "mongodb://localhost:27017"
    client = MongoClient(CONNECTION_STRING)

    return client['graffiti']

def generate_code(N) -> str:
    code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(N))
    return code

def pull_and_display(invitation_collection):
    code = generate_code(SIZE)
    print(code)
    invitation_collection.insert_one({
        'code': code,
        'used': False
    })

def perform():
    db = get_database()
    invitation_collection = db['invitations']

    pull_and_display(invitation_collection)
    print('Added invitation')

if __name__ == "__main__":
    COUNT = 0
    if len(sys.argv) > 1:
        COUNT = int(sys.argv[1])
    while COUNT > 0:
        # print(f'Sleeping for {SLEEP_DURATION} seconds')
        # time.sleep(SLEEP_DURATION)
        print(datetime.datetime.now())
        perform()
        print('Done\n')
        COUNT -= 1
        time.sleep(0.1)