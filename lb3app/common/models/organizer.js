// organizer.js

module.exports = function(Organizer){


    Organizer.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Organizer.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

