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
COLLECTION_INTENTOS_LOGIN_NAME = os.getenv('COLLECTION_INTENTOS_LOGIN_NAME')

# Configuraciones servicio de mensajería Twilio
TWILIO_SID= os.getenv('TWILIO_SID')
TWILIO_TOKEN= os.getenv('TWILIO_TOKEN')
TWILIO_FROM_PHONE= os.getenv('TWILIO_FROM_PHONE')
TWILIO_TO_PHONE= os.getenv('TWILIO_TO_PHONE')

# Configuraciones para encriptación
IV = os.getenv('IV_CRIPTO')
CLAVE = os.getenv('KEY_CRIPTO')

#Configuraciones de seguridad
SECRET_KEY = os.getenv("JWT_SECRET_KEY")       # sin valor por defecto: falla al arrancar si falta
ALGORITHM = os.getenv('ALGORITHM')
MINUTOS_TOKEN = int(os.getenv('JWT_MINUTOS', '60'))

MAX_INTENTOS_CUENTA = int(os.getenv('MAX_INTENTOS_CUENTA'))      # fallos por (correo + IP) en la ventana
MAX_INTENTOS_IP = int(os.getenv('MAX_INTENTOS_IP'))         # fallos por IP, sea cual sea el correo
VENTANA_SEGUNDOS = int(os.getenv('VENTANA_SEGUNDOS'))

CADENA_HASH_FALSO = os.getenv('CADENA_HASH_FALSO')