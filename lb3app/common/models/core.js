// core.js
var cache

const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022.min')
const _ = require('lodash')

module.exports = function(Core){

    Core.allData = function(cb) {
      if(cache) console.log('returning cache')
      if(cache && cache.timestamp && cache.timestamp > Date.now() - 24*3600*1000) return cb(null, cache)
      //series
      //festival
      //date
      //day
      //artist
      //artist alias
      //lineup
      //venue
      const finalDate = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')

      var series, festivals, dates, days, sets, artists, artistAliases, 
            venues,  images, lineups, organizers, places, 
            artistPriorities, stagePriorities, stageLayouts, 
            placeTypes, parentGenres, genres, artistGenres, 
            messageTypes, subjectTypes

      Promise.all([
        Core.app.models.Series.find()
          .then(res => series = res),
        Core.app.models.Festival.find()
          .then(res => festivals = res),
        Core.app.models.Venue.find()
          .then(res => venues = res),
        Core.app.models.Image.find()
          .then(res => images = res),
        Core.app.models.Organizer.find()
          .then(res => organizers = res),
        Core.app.models.ArtistPriority.find()
          .then(res => artistPriorities = res),
        Core.app.models.StagePriority.find()
          .then(res => stagePriorities = res),
        Core.app.models.StageLayout.find()
          .then(res => stageLayouts = res),
        Core.app.models.PlaceType.find()
          .then(res => placeTypes = res),
        Core.app.models.ParentGenre.find()
          .then(res => parentGenres = res),
        Core.app.models.Genre.find()
          .then(res => genres = res),
        Core.app.models.MessageType.find()
          .then(res => messageTypes = res),
        Core.app.models.SubjectType.find()
          .then(res => subjectTypes = res),
        Core.app.models.Date.find({where: {basedate: {gt: finalDate}}})
          .then(res => dates = res)
          .then(dateResult => Promise.all([
            Core.app.models.Day.find({where: {date: {inq: dateResult.map(d => JSON.parse(JSON.stringify(d)).id)}}})
              .then(res => days = res),
            Core.app.models.Festival.find({where: {id: {inq: dateResult.map(d => JSON.parse(JSON.stringify(d)).festival)}}})
              .then(festivalResult => Promise.all([
                
                Core.app.models.Lineup.find({where: {festival: {inq: festivalResult.map(d => JSON.parse(JSON.stringify(d)).id)}}})
                  .then(res => lineups = res),
                Core.app.models.Place.find({where: {festival: {inq: festivalResult.map(d => JSON.parse(JSON.stringify(d)).id)}}})
                  .then(res => places = res)
              ]))
              .then(([lineupResult]) => Core.app.models.Artist.find({where: {id: {inq: lineupResult.map(d => JSON.parse(JSON.stringify(d)).band)}}}))
              .then(res => artists = res)
              .then(artistResult => Promise.all([
                Core.app.models.ArtistGenre.find({where: {band: {inq: artistResult.map(d => JSON.parse(JSON.stringify(d)).id)}}})
                  .then(res => artistGenres = res),
                Core.app.models.ArtistAlias.find({where: {band: {inq: artistResult.map(d => JSON.parse(JSON.stringify(d)).id)}}})
                  .then(res => artistAliases = res)
              ]))
          ])
            .then(() => Core.app.models.Set.find({where: {or: [
              {
                band: {inq: artists.map(d => JSON.parse(JSON.stringify(d)).id)}
              },
              {
                day: {inq: days.map(d => JSON.parse(JSON.stringify(d)).id)}
              }
            ]}}))
            .then(res => sets = res))
        ])
          .catch(console.error)
          .then(() => {
            return {
              timestamp: Date.now(),
              Series: series,
              Festivals: festivals,
              Dates: dates,
              Days: days,
              Sets: sets,
              Artists: artists,
              ArtistAliases: artistAliases,
              Venues: venues,
              Images: images,
              Lineups: lineups,
              Organizers: organizers,
              Places: places,
              ArtistPriorities: artistPriorities,
              StagePriorities: stagePriorities,
              StageLayouts: stageLayouts,
              PlaceTypes: placeTypes,
              ParentGenres: parentGenres,
              Genres: genres,
              ArtistGenres: artistGenres,
              MessageTypes: messageTypes,
              SubjectTypes: subjectTypes,
            }
          })
          .then(coreData => cb(null, cache = coreData))
          .then(() => console.log('data gen complete'))
          .catch(cb)
        
    }


    Core.greet = function(msg, cb) {
      cb(null, 'Greetings... ' + msg);
    }

    Core.remoteMethod('greet', {
          accepts: {arg: 'msg', type: 'string'},
          returns: {arg: 'greeting', type: 'string'},
        http: {path: '/greet/:msg'}
    });
    Core.remoteMethod('allData', {
          returns: {arg: 'data', type: 'Object'},
        http: {path: '/all/data'}
    });
};

