import pyodbc

conn = pyodbc.connect(
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=localhost\\SQLEXPRESS;"
    "Database=AppPriceWise;"
    "UID=sa;"
    "PWD=SamIT6;"
)

print("✅ Connected successfully!")
