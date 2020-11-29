// file-handler.js

module.exports = function(Model) {
  Model.fileHandler = req => req.files[0].buffer.toString()
}