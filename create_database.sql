# Select the database
USE fleurderev;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    image VARCHAR(255),
    price DECIMAL(10, 2)
);

INSERT INTO products (name, image, price) VALUES
    ('Lavender Lilac Bouquet', 'flower1.jpg', 20.00),
    ('Pretty Poinsettia Bouquet', 'flower2.JPEG', 15.99),
    ('Dream Galore Bouquet ', 'flower3.jpeg', 32.50),
    ('Loving You Bouquet ', 'flower4.jpeg', 25.99),
    ('Belle Rosy Bouquet ', 'flower5.jpeg', 30.00),
    ('Pretty Pink Rose Bouquet', 'flower6.jpeg', 27.99),
    ('Classic Elegant Bouquet', 'flower7.jpeg', 30.99),
    ('Valentines Perfect Bouquet', 'flower8.jpeg', 35.00),
    ('Festival Florence Bouquet', 'flower9.jpeg', 28.00),


