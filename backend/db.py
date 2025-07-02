import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    conn_str = os.getenv("DATABASE_URL")
    return pyodbc.connect(conn_str)
