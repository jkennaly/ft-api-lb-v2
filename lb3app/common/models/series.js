// series.js

module.exports = function(Series){


    Series.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Series.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

