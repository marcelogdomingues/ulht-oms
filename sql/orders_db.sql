-- Selecionar o banco de dados
USE orders_db;

-- Criar tabela de pedidos
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
