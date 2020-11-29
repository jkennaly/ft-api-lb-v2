// artist.js

const _ =  require('lodash')

var toTitleCase = function (str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

module.exports = function(Artist){
  const addArtistToLineup = (festivalId) => artistName => {
    //See if the name is used as an alias
    return Artist.app.models.ArtistAlias.findOne({where: {alias: artistName}})
      .then(alias => alias ?
          {where: {id: alias.band}} :
          {where: {name: artistName}}
      )
      .then(whereObject => Artist.findOrCreate(whereObject,
        {name: artistName},
        (err, artist, created) => {
          if(err) {
            //console.log('err')
            throw new Error(err)
          } else if(!artist) {
            throw new Error('No artist found')
          }
           else {
            return artist.lineups.create({
              festival: festivalId,
              band: artist.id
            })

          }
          
        }
  ))
      .catch(err => console.error(err))
    }


    Artist.festivalLineup = function(req, festivalId, cb) {
      if(!req.files[0]) console.log('Artists festivalLineup', req)
        /*
      const str = Artist.fileHandler(req)
      const artistNameAr = _.uniq(str.split('\n').map(s => toTitleCase(s).trim())
        .filter(s => s))
        */
      const artistNameAr = Artist.artistsUploaded(req)
      console.log('artistNameAr', artistNameAr);

      //find or create each artist
      Promise.all(artistNameAr.map(addArtistToLineup(parseInt(festivalId, 10))))
        .then(() => Artist.find({where: {name: {inq: artistNameAr}}}, cb))
        .catch(cb)
      
      //add each artist to the festivalLineup

      
    // the files are available as req.files.
    // the body fields are available in req.body
    }

    Artist.discovery = function(req, cb) {
      Artist.app.models.Series.find()
      cb(null, []);
    }

    Artist.searchName = function(pattern, cb) {
      Artist.find({
        where: {name: {regexp: pattern}},
        limit: 5,
        fields: {id:true, name: true}
      }, cb)
    }

    Artist.addToLineup = function(data, festivalId, cb) {
      addArtistToLineup(parseInt(festivalId, 10))(toTitleCase(data.name).trim())
        .then(() => Artist.find({where: {name: toTitleCase(data.name).trim()}}, cb))
        .catch(cb)
      
      //add each artist to the festivalLineup

      
      // the files are available as req.files.
      // the body fields are available in req.body
    }

    Artist.merge = function(req, id1, id2, cb) {
      //find each Model that has any of the following fields:
        //band
        //artist
        //subject
      console.log('Artist merge')
      console.log(req.user)
      const targetFields = ['band', 'artist', 'subject']

      const modelDefinitions = Artist.app.models()
        .map(x => x.definition.ModelDefinition)
      //console.log(modelDefinitions)
      const bandModels = modelDefinitions
        .filter(n => n && n.properties.band)
      const artistModels = modelDefinitions
        .filter(n => n && n.properties.artist)
      const subjectModels = modelDefinitions
        .filter(n => n && n.properties.subject && con.getModelDefinition(n).properties.subjectType)
      //update where band=id2 to band=id1
      const updateBandModels = bandModels
        .map(n => Artist.app.models[n].updateAll({band: id2}, {band: id1}, (err, info) => {
          if(err) {
            console.log('updateBandModels artist.js 86')
            console.log(err)
          }
        }))
      //update where artist=id2 to artist=id1
      const updateArtistModels = artistModels
        .map(n => Artist.app.models[n].updateAll({artist: id2}, {artist: id1}, (err, info) => {
          if(err) {
            console.log('updateArtistModels artist.js 93')
            console.log(err)
          }
        }))
      //update where artist=id2 to artist=id1
      const updateSubjectModels = subjectModels
        .map(n => Artist.app.models[n].updateAll({subject: id2, subjectType: 2}, {subject: id1}, (err, info) => {
          if(err) {
            console.log('updateSubjectModels artist.js 101')
            console.log(err)
          }
        }))
        //get the old artist name
        const removeOld = Artist.findById(id2)
          .then(artist => {
            let oldName = artist.name
            artist.destroy()
            return oldName
          })
          .then(n => Artist.app.models.ArtistAlias.create({
            alias: n,
            band: id1,
            user: 2
          }))
          .catch(console.log)

        cb(null, 'OK')

        //delete the old artist
        //add the old artist name as an alias for the artist


    }

    Artist.remoteMethod('festivalLineup', {
          accepts: [
        {
        arg: 'req', type: 'object', http: function (ctx) {
            return ctx.req;
        }
        },
        {arg: 'festivalId', type: 'number', required: true}],
        http: {path: '/festivalLineup/:festivalId'},
      returns: {arg: 'data', type: 'array'}
    });

    Artist.remoteMethod('addToLineup', {
      accepts: [{ arg: 'data', type: 'Object', http: { source: 'body' } },
        {arg: 'festivalId', type: 'number', required: true}],
      http: {path: '/addToLineup/:festivalId'},
      returns: {arg: 'id', type: 'Object'}
    });

    Artist.remoteMethod('merge', {
      accepts: [{arg: 'req', type: 'object', http: ctx => ctx.req},
        {arg: 'artistId_1', type: 'number', required: true},
        {arg: 'artistId_2', type: 'number', required: true}],
      http: {path: '/admin/merge/:artistId_1/:artistId_2'},
      returns: {arg: 'id', type: 'Object'}
    });

    Artist.remoteMethod('discovery', {
      accepts: [{arg: 'req', type: 'object', http: ctx => ctx.req}],
      http: {path: '/discovery', verb: 'get'},
      returns: {arg: 'data', type: 'array'}
    });

    Artist.remoteMethod('searchName', {
      accepts: [{arg: 'pattern', type: 'String', required: true}],
      http: {path: '/search/:pattern', verb: 'get'},
      returns: {arg: 'data', type: 'array'}
    });
};




