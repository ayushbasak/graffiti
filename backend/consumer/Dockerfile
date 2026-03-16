FROM python:3.9-slim

WORKDIR /usr/src/app

# Install cron
RUN apt-get update && apt-get -y install cron && rm -rf /var/lib/apt/lists/*

# Install the MongoDB driver
RUN pip install pymongo

# Copy the python script AND the crontab file
COPY image_consumer.py .
COPY crontab crontab

# Apply cron job
RUN echo "" >> crontab && crontab crontab

# Start cron in the foreground. 
# We use a shell wrapper to ensure MONGO_URI is available to the crontab at runtime.
CMD printenv | grep -v "no_proxy" >> /etc/environment && cron -f
