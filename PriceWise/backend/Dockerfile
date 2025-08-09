FROM python:3.11-slim

# Set environment variable to avoid interactive prompts from Microsoft installer
ENV ACCEPT_EULA=Y
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies & remove conflicting ODBC libs
RUN apt-get update && apt-get install -y \
    gcc g++ curl gnupg \
    unixodbc-dev \
    && apt-get remove -y libodbc2 libodbcinst2 unixodbc-common \
    && rm -rf /var/lib/apt/lists/*

# Add Microsoft package signing key and repo
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && apt-get install -y msodbcsql18

# Set workdir and copy code
WORKDIR /app
COPY . /app

# Install Python deps
RUN pip install --no-cache-dir -r requirements.txt

# Expose and run
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port=${PORT:-8000}"]
