// profile.js

var jwt = require('jsonwebtoken');

module.exports = function(Profile){

    Profile.observe('before save', function filterProperties(ctx, next) {
        let oInstance = ctx.instance;

        if (oInstance) oInstance.password = oInstance.password || 'placeholder';

        next();
    });

    Profile.getUserId = function(userData, req, cb) {
    	const user = req.user
      const ftUser = user.ftUserId

      //const authHeader = req.header('Authorization')
    //console.log('authHeader', authHeader)
      if(ftUser) return cb(null, ftUser)


      //use the access token to get userinfo

    	//if(process.env.NODE_ENV === 'test') console.log('getUserId idToken userData', userData)
      //if(process.env.NODE_ENV === 'test') console.log('getUserId idToken user', user)
      
    	//compare the idToken user_id field and the user sub field to make sure they match
    	//console.log(user.sub)

    	//call database function to get username from user sub
    		//check if sub has an aliased id and return if present
    	const sql_stmt = 'SELECT user FROM `user_aliases` WHERE alias=?'
    	const params = [user.sub]
    	const createUser = function (err, result) {
            //console.log('createUser called', err, result)
    		Profile.create({
    			email: userData.email,
    			username: userData.username || userData.nickname || userData.email,
    			picture: userData.picture,
    			credits: 1
    		}, function (err, result) {
                if(err) {
                    console.log('Profile creation failed')
                    console.log(err)
                    return cb(err)
                }
		    	const sql_stmt = 'SELECT id FROM `Users` WHERE email=?'
		    	const params = [userData.email]
    			Profile.dataSource.connector.execute(sql_stmt, params, function (err, result) {
			    	const sql_stmt = 'INSERT INTO `user_aliases`(user, alias) VALUES (?, ?)'
			    	const params = [result[0].id, user.sub]
	    			Profile.dataSource.connector.execute(sql_stmt, params, err => err ? console.log(err) : undefined);
		    		cb(err, result[0].id)
    				
    			});

    		})
		    

    	}
    	const emailCheckCallback = function (err, result) {
    		//console.log('ecc called', err, result)
            if (err) {
    			console.log(err)
	    		cb(err, 0)
	    		return
    		}
    		console.log('emailCheckCallback', err, result)
    		//console.log(result)
	    	if(result.length) {
	    		//create an alias to the user with the matching email
		    	const sql_stmt = 'INSERT INTO `user_aliases`(user, alias) VALUES (?, ?)'
		    	const params = [result[0].id, user.sub]
    			Profile.dataSource.connector.execute(sql_stmt, params, err => err ? console.log(err) : undefined);
	    		cb(err, result[0].id)
	    		return
	    	} else createUser(err)
    	}
    	const callback = function (err, result) {
    		//console.log('callback called err result', err, result)
            if (err) console.log(err);
    		//console.log(result)
    		//if there is an error or a valid alias
	    	if(err || result && result.length) {
	    		cb(err, result && result.length ? result[0].user : 0)
	    		return
	    	}
	    	const emailVerified = userData.email_verified
	    	//if(emailVerified) {
		    	const sql_stmt = 'SELECT id FROM `Users` WHERE email=?'
		    	const params = [userData.email]
    			Profile.dataSource.connector.execute(sql_stmt, params, emailCheckCallback);

	    	//}

	    }
    	Profile.dataSource.connector.execute(sql_stmt, params, callback);

    		//if id_token says there is a verified email address, check existing user id fields for a matched email address,
    			// add an entry to the alias table for user sub and the user id
    			//return the user id
    		//if email address is not verified or there is no match, create a new user and return the user id for the new user, and add alias
      	//cb(null, 0);
    }

/*
  Profile.provideAuth0Token = function(mobilenumber, token, cb) {
    var app = Profile.app;
    // CHeck if the token does exist for the given phone number
    // if yes, check for the respective memeber

    if (!app.smsVerificationToken || !app.smsVerificationToken[mobilenumber] || app.smsVerificationToken[mobilenumber] !== token) {
      var wrongToken = new Error("Wrong or missing token");
      cb(wrongToken, "Wrong or missing token");
    } else {
      var timetolive = 86400;
      Profile.lookupByPhone(mobilenumber, function(err, theOne) {
        if (err) {
          cb(err, "Sorry, no such member here!");
        } else {
          // We can provide a token now for authentication
          // using the default createAccessToken method
          theOne.createAccessToken(timetolive, function(err, accesstoken) {
            cb(err, accesstoken);
          })
        }
      });
    }
  }
*/
    Profile.remoteMethod('getUserId', {
      	accepts: [
      { arg: 'userData', type: 'Object', http: { source: 'body' } },
			{arg: 'req', type: 'object', 'http': {source: 'req'}}
		],
        returns: {arg: 'id', type: 'number'},
        documented: false,
        http: {
          path: '/getUserId', 
        	verb: 'post'
        }
    });
/*
    Profile.remoteMethod(
    'provideAuth0Token', {
      accepts: [{
        arg: 'mobilenumber',
        type: 'string',
        description: 'Phone number including +65 and no spaces'
      }, {
        arg: 'token',
        type: 'string',
        description: 'the token received through Auth0'
      }],
      returns: {
        arg: 'token',
        type: 'string'
      },
      description: 'provide Auth0 token to confirm login',
      http: {
        path: '/smsauthenticate',
        verb: 'post'
      },
      isStatic: true
    }

  );

*/
};

