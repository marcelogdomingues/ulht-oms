# Base image for Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Copy your Node.js scripts to the container
COPY scripts/ scripts/

# Install MySQL Client for database interaction
RUN apt-get update && apt-get install -y default-mysql-client && apt-get clean

# Command to keep the container running (useful for interactive containers)
CMD ["tail", "-f", "/dev/null"]
