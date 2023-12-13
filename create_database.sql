CREATE DATABASE fleurderev;

# Select the database
USE fleurderev;

# Create the user which the web app will use to access the database
DROP USER IF EXISTS 'fleurs'@'localhost';
CREATE USER ‘fleurs’@‘localhost’ IDENTIFIED BY ‘flower2029’;
GRANT ALL PRIVILEGES ON fleurderev.* TO ‘fleurs’@‘localhost’;

#Remove tables if they exist already
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
  firstname VARCHAR(20) NOT NULL,
  surname VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  password VARCHAR(100)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    image VARCHAR(255),
    price DECIMAL(10, 2)
    occasion VARCHAR(50)
);
