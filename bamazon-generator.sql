DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE table products (
	itemID INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (itemID)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Tweezers","Personal Hygene",1.99,1000),
("Pride and Prejudice","Books",9.99,50),
("Milk","Food",1.99,500),
("Garbage Bags","Cleaning Goods",3.99,50),
("Dog Food","Pet Goods",19.99,300),
("Cat Food","Pet Goods",9.99,200),
("Orange Juice","Food",2.99,100),
("Tonka Truck","Toys",10.10,20),
("Lego Set","Toys",19.99,100),
("Running Shoes","Sports Apparel",59.99,100),
("Golf Clubs","Sporting Goods",399.99,20);

SELECT * FROM products; 

