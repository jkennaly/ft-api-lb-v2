// delete-override.js

const utils = require('loopback/lib/utils')

module.exports = function(Model) {
  Model.removeById = Model.deleteById = Model.destroyById = function(id, options, cb) {
    if (cb === undefined) {
      if (typeof options === 'function') {
        // destroyById(id, cb)
        cb = options;
        options = undefined
      }
    }
    cb = cb || utils.createPromiseCallback();

    Model.update({id: id}, {deleted: true}, options, cb)
    return cb.promise;
  };
}