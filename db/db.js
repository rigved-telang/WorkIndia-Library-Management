const mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "library_management"
});


connection.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log('Connected to MySQL successfully');
    }
});

module.exports = connection;