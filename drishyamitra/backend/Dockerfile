FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required by python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . .

# Ensure the instance folder exists for sqlite
RUN mkdir -p instance

# Add a script to run migrations and start the server
# Here we'll just run python app.py or rely on gunicorn in compose

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--timeout", "120"]
