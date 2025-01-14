from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()  # Load .env file

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')  # Use an environment variable or a default value
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')  # Example for database URI
    SQLALCHEMY_TRACK_MODIFICATIONS = not os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS').lower() == 'false'  # Example for database URI
    JWT_COOKIE_SECURE = not os.getenv('JWT_COOKIE_SECURE').lower() == 'false'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES')))
    JWT_ACCESS_COOKIE_NAME = os.getenv('JWT_ACCESS_COOKIE_NAME')
    JWT_COOKIE_CSRF_PROTECT = os.getenv('JWT_COOKIE_CSRF_PROTECT').lower() == 'true'
    