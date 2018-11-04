//node required includes
var mysql = require("mysql");
var inquirer = require("inquirer");

//let's connect to the DB we generate

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "strikers",
    database: "bamazon_db"
  });

connection.connect(function(err) {
    if (err) throw err;
    //console.log("I'm a connection!")
    menu();
});

function menu() {
    inquirer
    .prompt( [
        { 
            name: 'selection',
            type: 'list',
            message: 'Please select an option',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product','Exit']
        }
    ]).then (answers => {
        //console.log(JSON.stringify(answers, null, '  '));
        console.log(answers);
        //based on selection
        switch(answers.selection) {
            case "View Products for Sale" :
                productsSale();
            case "View Low Inventory" :
                lowInventory();
            case "Add to Inventory" :
                addInventory();
            case "Add New Product" :
                addProduct();
            case "Exit" :
                break;
            default:
                break;
        }
    });
}

function productsSale() {
    connection.query(
        "SELECT * from products",
        function(err, res) {
            if (err) throw err;
            //Lets make the data look nice
            //console.log(res);
            console.log("Available for purchase\n")
            for(let i=0; i<res.length;i++) {
                console.log("itemID: ",res[i].itemID,"\nProduct Name: ",res[i].product_name,"\nDepartment Name: ",res[i].department_name,"\nPrice: ",res[i].price,"\nStock Quantity: ",res[i].stock_quantity,"\n");
            }
            connection.end();
        }
    );
}

function lowInventory() {
    connection.query(
        "SELECT * from products",
        function(err, res) {
            if (err) throw err;
            //Lets make the data look nice
            //console.log(res);
            console.log("Inventory with less than 5 items.\n")
            for(let i=0; i<res.length;i++) {
                if(res[i].stock_quantity <5)
                    console.log("itemID: ",res[i].itemID,"\nProduct Name: ",res[i].product_name,"\nDepartment Name: ",res[i].department_name,"\nPrice: ",res[i].price,"\nStock Quantity: ",res[i].stock_quantity,"\n");
            }
            connection.end();
        }
    );
}

function addInventory() {
    connection.query(
        "SELECT * from products",
        function(err, res) {
            if (err) throw err;
            //Lets make the data look nice
            //console.log(res);
            console.log("Inventory with less than 5 items.\n")
            for(let i=0; i<res.length;i++) {
                if(res[i].stock_quantity <5)
                    console.log("itemID: ",res[i].itemID,"\nProduct Name: ",res[i].product_name,"\nDepartment Name: ",res[i].department_name,"\nPrice: ",res[i].price,"\nStock Quantity: ",res[i].stock_quantity,"\n");
            }
            connection.end();
        }
    );
}

function addProduct() {
    inquirer
    .prompt
    var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
        {
        quantity: 100
        },
        {
        flavor: "Rocky Road"
        }
    ],
    function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        deleteProduct();
    }
}