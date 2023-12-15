#select the database 
USE fleurderev;

INSERT INTO users (firstname, surname, email, hashed_password)
VALUES
    ('test', 'user' , 'test@user.com', '$2b$10$XJQLabqry7NyATaM7ysyt.rr5MW/mDKC9rt.ZHTSDp.daHJJuJLuu'),

INSERT INTO products (name, image, price, occasion) VALUES
    ('Lavender Lilac Bouquet', 'flower1.jpg', 20.00, 'Thank You'),
    ('Pretty Poinsettia Bouquet', 'flower2.JPEG', 15.99, 'Anniversary'),
    ('Dream Galore Bouquet', 'flower3.jpeg', 32.50, 'Wedding'),
    ('Loving You Bouquet', 'flower4.jpeg', 25.99, 'Wedding'),
    ('Belle Rosy Bouquet', 'flower5.jpeg', 30.00, 'Birthday'),
    ('Pretty Pink Rose Bouquet', 'flower6.jpeg', 27.99, 'Anniversary'),
    ('Classic Elegant Bouquet', 'flower7.jpeg', 30.99, 'Birthday'),
    ('Valentines Perfect Bouquet', 'flower8.jpeg', 35.00, 'Anniversary'),
    ('Festival Florence Bouquet', 'flower9.jpeg', 28.00, 'Thank You'),
    ('Beautiful Fleurs Bouquet', 'flower10.jpeg', 35.00, 'Birthday');

INSERT INTO basket (user_email, product_name, quantity, price)
VALUES 
    ('kraja003@gold.ac.uk', 'Lavender Lilac Bouquet', 2, 40.00);