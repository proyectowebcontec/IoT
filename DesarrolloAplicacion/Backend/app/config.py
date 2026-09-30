from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
COLLECTION_MONITOREO_NAME = os.getenv('COLLECTION_MONITOREO_NAME')

TWILIO_SID= os.getenv('TWILIO_SID')
TWILIO_TOKEN= os.getenv('TWILIO_TOKEN')
TWILIO_FROM_PHONE= os.getenv('TWILIO_FROM_PHONE')
TWILIO_TO_PHONE= os.getenv('TWILIO_TO_PHONE')