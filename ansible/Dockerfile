# Use the official Nginx image as the base
FROM nginx:latest

# Update package list and install OpenSSH server
RUN apt-get update && \
    apt-get install -y openssh-server && \
    mkdir /var/run/sshd

# Install Python
RUN apt-get update && \
    apt-get install -y python3 python3-pip

# Set a password for the root user (replace 'password' with a secure password)
RUN echo 'root:password' | chpasswd

# Allow root login via SSH
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Expose ports for Nginx and SSH
EXPOSE 80 22

# Start both SSH and Nginx services
CMD service ssh start && nginx -g 'daemon off;'