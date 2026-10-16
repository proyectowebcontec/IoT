from pymongo import MongoClient
from ..Subscriber.configure import MONGO_URI, DATABASE_NAME, COLLECTION_MONITOREO_NAME, COLLECTION_REGLASA_NAME


client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

monitoreos_collection = db[COLLECTION_MONITOREO_NAME]
reglas_collection = db[COLLECTION_REGLASA_NAME]