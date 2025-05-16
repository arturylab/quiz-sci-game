# Use an official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install build tools and gcc for compiling C code
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY backend/ ./backend/

# Compile the C shared library
WORKDIR /app/backend
RUN gcc -shared -o liblogic.so -fPIC logic.c

# Install Python dependencies
RUN pip install flask flask_cors

# Expose the Flask default port
EXPOSE 5000

# Run the Flask app
CMD ["python3", "app.py"]
