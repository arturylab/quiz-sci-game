# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ ./backend/

# Install Python dependencies
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Expose port 5001
EXPOSE 5001

# Run the app
CMD ["python", "app.py"]
