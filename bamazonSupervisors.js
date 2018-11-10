//node required includes
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table  = require("cli-table");

var table = new Table();
let data =[];

// instantiate
var table = new Table({
    head: ['DepartmentID', 'Department','Overhead Cost','Product Sales','Total Profit']
  , colWidths: [18, 25,25,25,25]
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
            choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
        }
    ]).then (answers => {
        //console.log(JSON.stringify(answers, null, '  '));
        console.log(answers);
        //based on selection
        switch(answers.selection) {
            case "View Product Sales by Department" :
                salesByDepartment();
                break;
            case "Create New Department" :
                newDepartment();
                break;
            case "Exit" :
                connection.end();
                break;
            default:
                break;
        }
    });
}

function salesByDepartment () {

    // console.log("| department_id | department_name | over_head_costs | product_sales | total_profit |");
    // console.log("|---------------|-----------------|-----------------|---------------|--------------|");

    connection.query(
        "SELECT departments.departmentID,departments.department_name,departments.over_head_costs,SUM(products.product_sales) AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name",
        function(err, res) {
            if (err) throw err;
            //Lets make the data look nice
            //console.log(res);
            for(let i=0;i<res.length;i++){
                data = [];
                let profit = res[i].product_sales ? (parseFloat(res[i].product_sales)-parseFloat(res[i].over_head_costs)) : -1*res[i].over_head_costs;
                if(!res[i].product_sales) res[i].product_sales = 0;
                //console.log("profit",profit);
                //console.log("log",res[i].departmentID,res[i].department_name,res[i].over_head_costs)
                data.push(res[i].departmentID,res[i].department_name,res[i].over_head_costs,res[i].product_sales,profit);
                table.push(data);
            }
            //console.log(table);
            displayTable(table);
            
        }
    );
}

function newDepartment () {
    let name,overhead;
    inquirer
    .prompt (
        [
            {
                type:'input',
                message:'Type the name of the department you would like to create',
                name:'name'
            }
    ]).then (answers => {
        name = answers.name;
        inquirer
        .prompt (
        [
            {
                type:'input',
                message:'What is the department overhead cost?',
                name:'overhead'
            }
        ]).then (answers => {
            overhead = answers.overhead;
            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: name,
                    over_head_costs: overhead
                },
                function(err, res) {
                    if(err) 
                        console.log(err);
                    else
                        console.log(res.affectedRows + " Department inserted!\n");
                    connection.end();
                }
            );
        });
    });
}

function displayTable(data) {
    //console.log(data.toString());
    console.log(table.toString());
    connection.end();
}