from pymongo import MongoClient
from dotenv import load_dotenv
import os
from logger import log

log.info("Connecting to MongoDB")
load_dotenv()
MONGODB_CONNECTION_URI = os.getenv("MONGODB_CONNECTION_URI")
db_connection = MongoClient(MONGODB_CONNECTION_URI)
log.info("Connected Successfully!")
db = db_connection.main_db

collection = db["users"]


def db_ping():
    try:
        db_connection.admin.command("ping")
        log.info("Pinged your deployment. All collections up!")
    except Exception as e:
        log.warn(e)
