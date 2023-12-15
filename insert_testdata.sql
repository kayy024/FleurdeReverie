#select the database 
USE fleurderev;

INSERT INTO users (firstname, surname, email, hashed_password)
VALUES
    ('test', 'user' , 'test@user.com', '$2b$10$XJQLabqry7NyATaM7ysyt.rr5MW/mDKC9rt.ZHTSDp.daHJJuJLuu'),

INSERT INTO products (name, image, price, occasion, description) VALUES
    ('Lavender Lilac Bouquet', 'flower1.jpg', 20.00, 'A fragrant blend of purple hues, perfect for charming occasions.'),
    ('Pretty Poinsettia Bouquet', 'flower2.JPEG', 15.99, 'Anniversary', 'A beautiful poinsettia bouquet that brings joy and warmth during the holiday season.'),
    ('Dream Galore Bouquet', 'flower3.jpeg', 32.50, 'Wedding', 'A dreamy arrangement, full of colors and blooms for enchanted moments.'),
    ('Loving You Bouquet', 'flower4.jpeg', 25.99, 'Wedding', 'Tender and expressive, a flower of love blooming in every sparkling bud.'),
    ('Belle Rosy Bouquet', 'flower5.jpeg', 30.00, 'Birthday', 'An enchanting array of pink hues that add a touch of elegance.'),
    ('Pretty Pink Rose Bouquet', 'flower6.jpeg', 27.99, 'Anniversary', 'Soft and gentle, a symphony of sweet pink roses for a heartfelt message.' ),
    ('Classic Elegant Bouquet', 'flower7.jpeg', 30.99, 'Birthday', ' A bouquet of timeless elegance and everlasting charm.'),
    ('Valentines Perfect Bouquet', 'flower8.jpeg', 35.00, 'Anniversary', 'The epitome of love, passion, and romance in one beautiful bouquet.' ),
    ('Festival Florence Bouquet', 'flower9.jpeg', 28.00, 'Thank You', 'Colorful festivity, a flower festival that brings to life the beauty of Florence.'),
    ('Beautiful Fleurs Bouquet', 'flower10.jpeg', 35.00, 'Birthday', 'A precious beautiful bouquet of flowers for pure joy and love.');

INSERT INTO basket (user_email, product_name, quantity, price)
VALUES 
    ('kraja003@gold.ac.uk', 'Lavender Lilac Bouquet', 2, 40.00);