# Use an official Python base image
FROM python:3.13.1-slim

# Set the working directory in the container
WORKDIR /app

# Copy the server folder into the container
COPY server/ server/

# Copy only the build folder from the local client directory
COPY client/build client/build/

# Install Python dependencies
RUN pip install --no-cache-dir -r server/requirements.txt

# Expose the port the app runs on
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "server/app.py"]
