-- DROP DATABASE IF EXISTS bamazon_db;

-- CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE table departments (
	departmentID INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (departmentID)
);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Personal Hygene",50000),
("Books",40000),
("Food",100000),
("Cleaning Goods",25000),
("Pet Goods",10000),
("Toys",5000),
("Sporting Goods",15000);

SELECT * FROM departments; 