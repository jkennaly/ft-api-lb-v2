// file-spreadsheet-review.js

const XLSX = require('xlsx')

module.exports = function(Model) {
  Model.reviews = req => {
    const workbook = XLSX.read(req.files[0].buffer, {type:'buffer'})
    

  } 

}