let devObject = require('./datasources.json')

if(process.env.JAWSDB_URL) devObject.FestivalMaster = {
    "url": process.env.JAWSDB_URL + '?connectionLimit=' + process.env.CONN_LIMIT + '&debug=false',
    "connector": "mysql",
    "connectionLimit": process.env.CONN_LIMIT
}

devObject.mem = {
	name: 'mem',
	connector: "memory"
}

module.exports = devObject
