// stageLayout.js

module.exports = function(StageLayout){



    StageLayout.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    StageLayout.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

