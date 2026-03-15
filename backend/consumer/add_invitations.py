from pymongo import MongoClient
import datetime
import random
import string
import sys
import os

# SLEEP_DURATION = 1 # seconds
SIZE = 6

def get_database():
    CONNECTION_STRING = os.environ.get('MONGO_URI')
    if not CONNECTION_STRING:
        raise ValueError("MONGO_URI environment variable is not set")
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

def perform(DEBUG):
    db = get_database()
    invitation_collection = db['invitations']

    pull_and_display(invitation_collection)
    if DEBUG: print('Added invitation')

if __name__ == "__main__":
    COUNT = 0
    if len(sys.argv) == 3:
        COUNT = int(sys.argv[1])
        DEBUG = sys.argv[2].lower() == 'debug'
    else: exit(1)
    if DEBUG: print(datetime.datetime.now())
    perform(DEBUG)
    if DEBUG: print('Done\n')
    COUNT -= 1