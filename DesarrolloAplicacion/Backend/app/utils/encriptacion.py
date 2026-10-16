from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from config import CLAVE, IV

class Crypt:
    def __init__(self):
        self.key = CLAVE.encode()
        self.iv = IV.encode()
        self.backend = default_backend()


    def encrypt(self, text):
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(text.encode()) + padder.finalize()

        cipher = Cipher(algorithms.AES(self.key), modes.CBC(self.iv), backend=self.backend)
        encryptor = cipher.encryptor()

        # Encriptar el texto
        encrypted_text = encryptor.update(padded_data) + encryptor.finalize()
        return encrypted_text.hex()
    
    
    def decrypt(self, encrypted_text):
        # Convertir el texto encriptado de hexadecimal a bytes
        encrypted_data = bytes.fromhex(encrypted_text)

        cipher = Cipher(algorithms.AES(self.key), modes.CBC(self.iv), backend=default_backend())
        decryptor = cipher.decryptor()

        # Desencriptar el texto
        decrypted_padded_text = decryptor.update(encrypted_data) + decryptor.finalize()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        decrypted_text = unpadder.update(decrypted_padded_text) + unpadder.finalize()
        
        return decrypted_text.decode()