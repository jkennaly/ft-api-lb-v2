// stagePriority.js

module.exports = function(StagePriority){


    StagePriority.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    StagePriority.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

