console.log("Application starts ...");
var mysql = require('mysql2');
var execsql = require('execsql')
const fs = require('fs')
const rl = require('readline')
const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
})

const qp = question => new Promise((resolve, reject) => {readline.question(question, response => resolve(response))})

var username, password, dbname
qp(`Username to access the database [festigram]`)
	.then(name => {
		username = name ? name : 'festigram'
		return qp(`password for database user [festigram]`)
	})
	.then(pw => {
		password = pw ? pw : 'festigram'
		return qp(`database name [festigram]`)
	})
	.then(db => {
		dbname = db ? db : 'festigram'
		readline.close()
		var dbconfig = {
		  host: "localhost",
		  user: username,
		  password: password,
		  database: dbname,
		  multipleStatements: true
		}
		/*
		execsql.config(dbconfig)
			.execFile(__dirname + '/init/fest.sql', function(err, results){
		        console.log(results);
		    }).end();
		   */

		fs.readFile(__dirname + '/init/fest.sql', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    // parse JSON object
    const query = data.toString();


		var con = mysql.createConnection(dbconfig);
		con.connect(function(err) {
		  console.log("[fill database in MySql] - block BEGIN ");  
		  if (err) throw err;
		  varId = 6;
		  con.query(query, function (err, result, fields) {
		    if (err) throw err;
		   // console.log(result);
		  });
		  con.end();

		  //create datasources json
		  const base = {
			  "db": {
			    "name": "db",
			    "connector": "memory"
			  },
			  "local": {
			    "host": "127.0.0.1",
			    "port": 3306,
				  "user": username,
				  "password": password,
				  "database": dbname,
			    "name": "local",
			    "connector": "mysql",
			    "connectionLimit": 8
			  }
			}
			const data = JSON.stringify(base)
		   fs.writeFile(__dirname + '/../server/datasources.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("datasources data is saved.");
})
		  console.log("[fill database in MySql] - block END");
		 
})
		});
			console.log("END of the application.");
	})
 

	/*
 
 */