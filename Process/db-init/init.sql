-- Use MySQL native password authentication for root user
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'rootpassword';
FLUSH PRIVILEGES;

-- Drop the database if it exists and create a fresh one
DROP DATABASE IF EXISTS orders_db;
CREATE DATABASE orders_db;

-- Select the newly created database
USE orders_db;

-- Create the orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);