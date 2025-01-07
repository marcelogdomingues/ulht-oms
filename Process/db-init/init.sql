-- Use MySQL native password authentication for the root user
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'rootpassword';
FLUSH PRIVILEGES;

-- Enable the MySQL Event Scheduler
SET GLOBAL event_scheduler = ON;

-- (Optional) Add event_scheduler setting in the configuration file for persistence
-- This part is a comment; you can't include it in the script directly:
-- Add 'event_scheduler=ON' to your my.cnf or my.ini under the [mysqld] section.

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

-- Create an Event to clean up records older than 10 years
CREATE EVENT IF NOT EXISTS cleanup_old_orders
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM orders WHERE order_date < NOW() - INTERVAL 10 YEAR;
