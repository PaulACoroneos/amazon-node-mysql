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
});

connection.query(
    "SELECT * from products",
    function(err, res) {
      if (err) throw err;
      //Lets make the data look nice
      //console.log(res);
      console.log("Available for purchase\n")
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

function promptUser() {
    inquirer
    .prompt ([
        {
            type:'input',
            name:'id',
            message: 'Type the ID of the product you would like to buy'
        }
    ])
    .then (answers => {
       //console.log(JSON.stringify(answers, null, '  '));
       //console.log(answers);
       promptUser2(answers);
    });
}

function promptUser2(id) {
    inquirer
    .prompt ([
        {
            type:'input',
            name:'quantity',
            message: 'How many would you like to buy?'
        }
    ])
    .then (answers => {
       //console.log(JSON.stringify(answers, null, '  '));
       //console.log(answers);
       transactionCheck(answers,id);
    });

}

function transactionCheck(quantity,id) {
    
    //check if we even have enough of the item
    //console.log(quantity,id);
    connection.query(
        "SELECT itemID,stock_quantity,price FROM products",
        function(err, res) {
            if (err) throw err;
            if(res[id.id-1].stock_quantity < quantity.quantity) {
                console.log("Sorry we don't have enough. Cancelling transaction.");
                connection.end();
            }
            else
                transactAndTotal(quantity,id,res[id.id-1].stock_quantity,res[id.id-1].price);
        }
    );
}

function transactAndTotal (quantity,id,stock,price) {
    //console.log(quantity,id,stock);
    let newStock = stock-quantity.quantity; 
    let newSales = quantity.quantity*price;
    //okay let's do this
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: newStock,
            product_sales: newSales

          },
          {
            itemID: id.id
          }
        ],
    );
    console.log("Your total is: $",quantity.quantity*price,"\nThanks for your business!");    
    connection.end();
}

function displayTable(data) {
    //console.log(data.toString());
    console.log(table.toString());
    // prompt the user for if they want to bid or post
    promptUser();
    //connection.end();
}