# Use the official Node.js image as the base
FROM node:latest

# Update package list and install OpenSSH server
RUN apt-get update && \
    apt-get install -y openssh-server && \
    mkdir /var/run/sshd

# Install Python
RUN apt-get install -y python3 python3-pip

# Set a password for the root user (replace 'password' with a secure password)
RUN echo 'root:password' | chpasswd

# Allow root login via SSH
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Expose ports for the Node.js web server and SSH
EXPOSE 3000 22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install PM2
RUN npm install -g pm2

# Start both the web server (app.js) and the database script (store-events.js)
CMD service ssh start && pm2 start app.js --name web-server && pm2 start store-events.js --name db-worker --no-autorestart && pm2 logs
