// parentGenre.js

module.exports = function(ParentGenre){


    ParentGenre.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    ParentGenre.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

