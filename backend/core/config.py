import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

PYODBC_CONN_STR = os.getenv("PYODBC_CONN_STR")
DATABASE_URL = os.getenv("DATABASE_URL")
BASE_URL = os.getenv("BASE_URL")

engine = create_engine(DATABASE_URL)

