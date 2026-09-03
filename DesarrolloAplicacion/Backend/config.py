from dotenv import load_dotenv
import os

load_dotenv()

# MQTT broker settings
BROKER = os.getenv('BROKER')
PORT = int(os.getenv('PORT'))
TOPIC = os.getenv('TOPIC')
CLIENT_ID = os.getenv('CLIENT_ID')

MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
COLLECTION_NAME = os.getenv('COLLECTION_NAME')