// day.js

module.exports = function(Day){


    Day.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Day.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

