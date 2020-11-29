'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

const mysql = require('mysql2');
const _ = require('lodash');

var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var bodyParser = require('body-parser');
var multer = require('multer');



var sslRedirect = require('heroku-ssl-redirect')

var app = module.exports = loopback();


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
} else {
app.use(sslRedirect())
 app.use(function(req, res, next) {
 if(!/0441\.design$/.test(req.headers.host)) {

    const newURL = ['https://festigram.0441.design', req.url].join('');
    return res.redirect(newURL);
  }
  next()
}) 
}




var authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://festivaltime.auth0.com/.well-known/jwks.json"
    }),
    //audience: 'https://immense-ridge-26505.herokuapp.com/api/',
    issuer: 'https://festivaltime.auth0.com/',
    algorithms: ['RS256'],
    credentialsRequired: false
})

app.use(authCheck)

var guard = require('express-jwt-permissions')({
  permissionsProperty: 'scope'
})

const createFestivals = [
  /Artists/,
  /ArtistAliases/,
  /Dates/,
  /Days/,
  /Festivals/,
  /Lineups/,
  /Organizers/,
  /ParentGenres/,
  /Series/,
  /Sets/,
  /StageLayouts/,
  /StagePriorities/,
  /Venues/
]

const createMessages = [
  /ArtistGenres/,
  /ArtistPriorities/,
  /Genres/,
  /Images/,
  /Intentions/,
  /Messages/,
  /MessagesMonitors/,
  /Places/,
  /Profiles/
]

const loggedOnly = [
  /Intentions/,
  /MessagesMonitors/

]

const admin = [
  /MessageTypes/,
  /PlaceTypes/,
  /SubjectTypes/
]


app.post(createFestivals, guard.check('create:festivals'))
app.put(createFestivals, guard.check('create:festivals'))
app.delete(createFestivals, guard.check('create:festivals'))
//app.use(/verify/g, guard.check('verify:festivals'))
app.get(loggedOnly, function (err, req, res, next) {
    if (err) return next(err)
    if(req.user) return next()
    res.status(401).send('Logged only for this endpoint')
})
app.get(loggedOnly, guard.check('create:messages'))
app.post(createMessages, guard.check('create:messages'))
app.put(createMessages, guard.check('admin'))
app.delete(createMessages, guard.check('admin'))

app.post(admin, guard.check('admin'))
app.put(admin, guard.check('admin'))
app.delete(admin, guard.check('admin'))

//user request has passed security, now get ftUserId
app.use('/api/Profiles/getUserId*', function (req, res, next) {
  const authId = req.user.sub
  const aliasTable = app.get('aliasTable')
  var foundAlias = aliasTable[authId]
  //console.log('foundAlias ' + foundAlias)
  if(!foundAlias) {
    //get highest id in alias Table
    const highId = _.reduce(aliasTable, (hi, el) => el && el > hi ? el : hi, 0)
    //load all aliases with ids higher
    
    const connection = mysql.createConnection(process.env.JAWSDB_URL + '?connectionLimit=1&debug=false');
    connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    //console.log('connected as id ' + connection.threadId + ' at ' + req.originalUrl);
    })
    connection.execute(
      'SELECT * FROM `user_aliases` WHERE `id` > \'?\'',
      [highId],
      (err, results, fields) => {
        if(err) return next(err)
          const resultPairs = results.map(r => [r.alias, r.user])
          _.assign(aliasTable, _.fromPairs(resultPairs))
          if(aliasTable[authId]) {
            req.user.ftUserId = aliasTable[authId]
            app.set('ftUserId', req.user.ftUserId)
            app.set('scope', req.user.scope)
            //console.log('userId Set A ' + req.user.ftUserId)

          }
            /*
            else {
              //user not found
            }
            */
          //console.log('using loaded alias')
          //console.log(req.user)
          next()
      }
    )
    connection.end()
    //console.log('connected ended ' + req.originalUrl)
  } else {
    req.user.ftUserId = foundAlias
    app.set('ftUserId', req.user.ftUserId)
    app.set('scope', req.user.scope)
    //console.log('userId Set B ' + req.user.ftUserId)
    //console.log('using cached alias')  
    //console.log(req.user)
    next()
  }

});

app.use('/api/*', function(req, res, next) {
  const aliasTable = app.get('aliasTable')
  //console.log('server.js 114 aliasTable', aliasTable, req.user)

  if(req.user && !req.user.ftUserId) {
    const authId = req.user.sub
    const aliasTable = app.get('aliasTable')
    var foundAlias = aliasTable[authId]
    req.user.ftUserId = foundAlias
    if(foundAlias) {
      app.set('ftUserId', req.user.ftUserId)
      app.set('scope', req.user.scope)
    } else {
        //get highest id in alias Table
      const highId = _.reduce(aliasTable, (hi, el) => el && el > hi ? el : hi, 0)
      //load all aliases with ids higher
      
      const connection = mysql.createConnection(process.env.JAWSDB_URL + '?connectionLimit=1&debug=false');
      connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }

      //console.log('connected as id ' + connection.threadId + ' at ' + req.originalUrl);
      })
      connection.execute(
        'SELECT * FROM `user_aliases` WHERE `id` > \'?\'',
        [highId],
        (err, results, fields) => {
          if(err) return next(err)
            const resultPairs = results.map(r => [r.alias, r.user])
            _.assign(aliasTable, _.fromPairs(resultPairs))
            if(aliasTable[authId]) {
              req.user.ftUserId = aliasTable[authId]
              app.set('ftUserId', req.user.ftUserId)
              app.set('scope', req.user.scope)
              //console.log('userId Set A ' + req.user.ftUserId)

            }
              
              else {
                //user not found
              }
              
            //console.log('using loaded alias')
            //console.log(req.user)
        }
      )
      connection.end()
    }
  }
  next()
})

/*
// apply to a path
app.use('/*', function(req, res, next) {
  console.log('server.js 128 req ')
  //console.log(aliasTable)
  next()
})
app.use('/api/Festivals', function(req, res, next) {
    res.json("It has valid token", req.user);
});
app.use('/api/*', function (req, res, next) {
  console.log(req.user)
  next()
});
*/


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer().any()); // for parsing multipart/form-data


// catch error
app.use(function (err, req, res, next) {
    if (err && err.name === 'UnauthorizedError') {
      //authCheck
      if(!/jwt expired/.test(err.message)) {
        console.log('Invalid token, or no token supplied!')
        console.log(req.get('Authorization'))
        console.log(req.user)
        console.log(err)
      }
        res.status(401).send('Invalid token, or no token supplied!');
    } else if (err.code === 'permission_denied') {
      //guard
      res.status(403).send('Forbidden');
    } else if(err) {
        console.log(err)
        res.status(401).send(err);
    }
});



//var MYSQL_CONNECTION_STRING = process.env.NODE_ENV === 'production' ? process.env.JAWSDB_URL : ''
//console.log(process.env.JAWSDB_URL)
app.start = function() {
  // start the web server
   var port = process.env.PORT || 8080;
  return app.listen(port, function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    
    /*
    if (process.env.NODE_ENV === 'test' && app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
    */
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
