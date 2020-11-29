// artistGenre.js

module.exports = function(ArtistGenre){


    ArtistGenre.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    ArtistGenre.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'}
    });
};

