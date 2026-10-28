FROM python:3.10-slim

WORKDIR /app

# Copy requirements from root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY app/backend/ ./app/backend/
COPY models/ ./models/
COPY data/ ./data/

# Expose port
EXPOSE 8000

# Run command
CMD ["uvicorn", "app.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
