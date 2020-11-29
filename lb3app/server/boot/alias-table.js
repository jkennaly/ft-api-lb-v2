// server/boot/alias-table.js

const mysql = require('mysql2');
const _ = require('lodash');

module.exports = function(app, callback) {
  
    const connection = mysql.createConnection(process.env.JAWSDB_URL + '?connectionLimit=1&debug=false');
    connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  //console.log('connected as id ' + connection.threadId + ' at ' + req.originalUrl);
})
    connection.execute(
      'SELECT * FROM `user_aliases`',
      [],
      (err, results, fields) => {
        if(err) return callback(err)
        var aliasTable = {}
      	const resultPairs = results.map(r => [r.alias, r.user])
     	_.assign(aliasTable, _.fromPairs(resultPairs))
     	app.set('aliasTable', aliasTable)
      	callback()
      }
    )
    connection.end()
};
