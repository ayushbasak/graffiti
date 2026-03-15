FROM python:3.9-slim

WORKDIR /usr/src/app

# Install cron
RUN apt-get update && apt-get -y install cron && rm -rf /var/lib/apt/lists/*

# Install the MongoDB driver
RUN pip install pymongo

# Copy the python script AND the crontab file
COPY image_consumer.py .
COPY crontab /etc/cron.d/crontab

# Give execution rights and apply cron job
RUN chmod 0644 /etc/cron.d/crontab
RUN crontab /etc/cron.d/crontab

# Run the cron daemon in the foreground
CMD ["cron", "-f"]
