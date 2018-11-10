//node required includes
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table  = require("cli-table");

var table = new Table();
let data =[];

// instantiate
var table = new Table({
    head: ['Item ID', 'Product Name','Department Name','Product Sales','Price','Stock Quantity']
  , colWidths: [18, 25,25,25,25,25]
});

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
                break;
            case "View Low Inventory" :
                lowInventory();
                break;
            case "Add to Inventory" :
                addInventory();
                break;
            case "Add New Product" :
                addProduct();
                break;
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
            // for(let i=0; i<res.length;i++) {
            //     console.log("itemID: ",res[i].itemID,"\nProduct Name: ",res[i].product_name,"\nDepartment Name: ",res[i].department_name,"\nPrice: ",res[i].price,"\nStock Quantity: ",res[i].stock_quantity,"\n");
            // }
            //connection.end();
            for(let i=0; i<res.length;i++) {
                //console.log("itemID: ",res[i].itemID,"\nProduct Name: ",res[i].product_name,"\nDepartment Name: ",res[i].department_name,"\nPrice: ",res[i].price,"\nStock Quantity: ",res[i].stock_quantity,"\n");
                data = [];
                data.push(res[i].itemID,res[i].product_name,res[i].department_name,res[i].product_sales,res[i].price,res[i].stock_quantity);
                table.push(data);
                //console.log(table);
            }
            displayTable(table);
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
                //console.log("itemID: ",res[i].itemID,"\nProduct Name: ",res[i].product_name,"\nDepartment Name: ",res[i].department_name,"\nPrice: ",res[i].price,"\nStock Quantity: ",res[i].stock_quantity,"\n");
                data = [];
                if(res[i].stock_quantity < 5) {
                    data.push(res[i].itemID,res[i].product_name,res[i].department_name,res[i].product_sales,res[i].price,res[i].stock_quantity);
                    table.push(data);
                }
                //console.log(table);
            }
            displayTable(table);
           // connection.end();
        }
    );
}

function addInventory() {

    inquirer
    .prompt( [
        { 
            name: 'select',
            type: 'input',
            message: 'Please select which itemId you would like to add inventory to.',
        }
    ]).then (answers => {

        let itemUpdate = answers.select;
        console.log("item to update ",itemUpdate);
        inquirer
        .prompt( [
            { 
                name: 'newStock',
                type: 'input',
                message: 'And what quantity would you like to add?',
            }
        ]).then (answers => {

            let newStock = parseInt(answers.newStock);
            //console.log("new stock ",newStock);
            //okay getting existing inventory on selected itemID
            var query1 = connection.query(
                "SELECT itemID,stock_quantity FROM products", function(err, res) {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    console
                    let existingStock = parseInt(res[itemUpdate-1].stock_quantity);
                    //console.log("existing stock ",existingStock);
                    newStock += existingStock;
                    var query2 = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                            stock_quantity: newStock
                            },
                            {
                            itemID: itemUpdate
                            }
                        ],
                        function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " products updated!\n","New stock for item is: ",newStock);
                        }
                        
                    );
                    connection.end();
                });
            });
        });
    }

function addProduct() {
    let productDepartment,productName,productQuantity,productPrice;
    //console.log("hi");
    inquirer
    .prompt (
        [
            {
                type:'input',
                message:'Type the name of the product you want to add',
                name:'productName'
            }
    ]).then (answers => {
        productName = answers.productName;
        inquirer
        .prompt (
        [
            {
                type:'input',
                message:'Type the price of the product',
                name:'productPrice'
            }
        ]).then (answers => {
            productPrice = answers.productPrice;
            inquirer
            .prompt (
            [
                {
                    type:'input',
                    message:'Type the initial product quantity',
                    name:'productQuantity'
                }
            ]).then (answers => {
                productQuantity = answers.productQuantity;
                inquirer
                .prompt (
                [
                    {
                        type:'input',
                        message:'Type the product department',
                        name:'productDepartment'
                    }
                ]).then (answers => {
                    productDepartment = answers.productDepartment;
                    console.log("Inserting a new product...\n");
                    var query = connection.query(
                        "INSERT INTO products SET ?",
                        {
                            stock_quantity: productQuantity,
                            department_name: productDepartment,
                            product_name: productName,
                            price: productPrice
                        },
                        function(err, res) {
                            console.log(res.affectedRows + " product inserted!\n");
                            connection.end();
                        }
                    );
                });
            });
        });   
    });
}

function displayTable(data) {
    //console.log(data.toString());
    console.log(table.toString());
    // prompt the user for if they want to bid or post
    //promptUser();
    connection.end();
}