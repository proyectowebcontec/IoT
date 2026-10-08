from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME, COLLECTION_MONITOREO_NAME


client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

monitoreos_collection = db[COLLECTION_MONITOREO_NAME]