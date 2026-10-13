from dotenv import load_dotenv
import os

load_dotenv()

# Configuraciones base de datos MongoDB
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
COLLECTION_MONITOREO_NAME = os.getenv('COLLECTION_MONITOREO_NAME')
COLLECTION_USUARIO_NAME = os.getenv('COLLECTION_USUARIO_NAME')
COLLECTION_ALARMALOG_NAME = os.getenv('COLLECTION_ALARMALOG_NAME')
COLLECTION_DISPOSITIVO_NAME = os.getenv('COLLECTION_DISPOSITIVO_NAME')
COLLECTION_EMPRESA_NAME = os.getenv('COLLECTION_EMPRESA_NAME')
COLLECTION_POLIPASTO_NAME = os.getenv('COLLECTION_POLIPASTO_NAME')

# Configuraciones servicio de mensajería Twilio
TWILIO_SID= os.getenv('TWILIO_SID')
TWILIO_TOKEN= os.getenv('TWILIO_TOKEN')
TWILIO_FROM_PHONE= os.getenv('TWILIO_FROM_PHONE')
TWILIO_TO_PHONE= os.getenv('TWILIO_TO_PHONE')

# Configuraciones para encriptación
IV = os.getenv('IV_CRIPTO')
CLAVE = os.getenv('KEY_CRIPTO')