import pyodbc

conn = pyodbc.connect(
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=AppPriceWiseDB.mssql.somee.com;"
    "Database=AppPriceWiseDB;"
    "Uid=SamWison_SQLLogin_1;"
    "Pwd=6gq7tg7e39;"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)

if conn: 
    print("Connected")
else:
    print("Connection failed")
