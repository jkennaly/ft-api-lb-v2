// festival.js

const _ = require('lodash');

module.exports = function(Festival){


  Festival.greet = function(msg, cb) {
    cb(null, 'Greetings... ' + msg);
  }

  Festival.superEventsPromise = function(id, cb) {
    return Promise.resolve({seriesIds: [Festival.findById(id).series]})
  }

  Festival.subEventsPromise = function(id, cb) {
          
    const datesPromise = Festival.app.models.Date.find({festival: id})
    const daysPromise = datesPromise
      .then(dates => Promise.all(dates.map(date => Festival.app.models.Day.find({}))))
    const setsPromise = datesPromise
      .then(days => Promise.all(days.map(day => Festival.app.models.Set.find({}))))
    const allSubEvents = Promise.all([datesPromise, daysPromise, setsPromise])
      .then(([dates, days, sets]) => {
        return {
          dateIds: dates.map(x => x.id),
          dayIds: days.map(x => x.id),
          setIds: sets.map(x => x.id)
        }
      })
      .catch(cb)
    return allSubEvents
  }

  Festival.relatedEvents = function(id, cb) {
    /*
      const logTime = (() => {
        const startTime = new Date()
        return description => result => {
          console.log(description)
          console.log('elapsed ms since Festival.relatedEvents ' + ((new Date()) - startTime))
          //console.log(result)
          return result
        }
      })()
      */
    const sql_stmt = 'SELECT * FROM `related_events` WHERE `festival`=\'?\''
    const params = [id]
    const eventsPromise = new Promise(function(resolve, reject) {
        Festival.dataSource.connector.execute(sql_stmt, params, function(err, units) {
            if (err) {
                return reject(err);
            }
            return resolve(units);
        })
      })
      .then(eventArray => eventArray.reduce((evObj, ev) => {
        evObj.seriesIds.push(ev.series)
        evObj.festivalIds.push(ev.festival)
        evObj.dateIds.push(ev.date)
        evObj.dayIds.push(ev.day)
        evObj.setIds.push(ev.set)
        return evObj
      }, {
        seriesIds: [],
        festivalIds: [],
        dateIds: [],
        dayIds: [],
        setIds: []
      }))
      .then(evObj => _.mapValues(evObj, ids => _.uniq(ids)))
      //.then(logTime('eventsPromise'))
      .catch(cb)

    return eventsPromise
    /*
    const superPromise = Festival.superEventsPromise(id, cb)
    const subPromise = Festival.subEventsPromise(id, cb)
    return Promise.all([superPromise, subPromise])
      .then(([superObj, subObj]) => _.assign(superObj, subObj))
      .catch(cb)
    */
  }


  Festival.remoteMethod('greet', {
        accepts: {arg: 'msg', type: 'string'},
        returns: {arg: 'greeting', type: 'string'}
  });
};

