// file-spreadsheet-artist.js

const XLSX = require('xlsx')

module.exports = function(Model) {
  Model.artistsUploaded = req => {
    const workbook = XLSX.read(req.files[0].buffer, {type:'buffer'})
    const artistArrayRaw = workbook.SheetNames.map(n => workbook.Sheets[n]).map(sheet => XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankRows: false
    }))[0].filter(x => x.length)
    console.log('artistArrayRaw', workbook.SheetNames, artistArrayRaw)
    return artistArrayRaw.map(x => x[0])


  } 

}