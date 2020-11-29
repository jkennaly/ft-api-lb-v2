// venue.js

module.exports = function(Venue){



    Venue.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Venue.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

