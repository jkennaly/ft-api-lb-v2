// lineup.js
var toTitleCase = function (str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

module.exports = function(Lineup){



    Lineup.batchDelete = function(data, cb) {
      if(!data.ids || !data.ids.length) return cb(null, 'OK')

      //console.log('Lineup.batchDelete')
      //console.log(data)

      Promise.all(data.ids.map( id => Lineup.findById(id)))
      //first remove sets
        .then(lineups => Promise.all(lineups.map(lineup => Lineup.app.models.Set.lineupRemove(lineup))))
        //then remove lineups
        .then(() => Promise.all(data.ids.map(id => Lineup.deleteById(id))))
      .then(() => Lineup.find({where: {id: {inq: data.ids}}}, cb))
      .catch(cb)
    
    }

    Lineup.batchUpdate = function(data, cb) {

      //console.log('Lineup.batchCreate')
      //console.log(data)

      Promise.all(
        data
          .filter(d => d.id)
          .map(dataEl => Lineup.updateAll({id: dataEl.id}, dataEl))
      )
      .then(() => Lineup.find({where: {id: {inq: data.map(x => x.id)}}}, cb))
      .catch(cb)
/*
      data.forEach(dataEl => dataEl.id && Lineup.updateAll({id: dataEl.id}, dataEl,
        (err, instance) => {
          if(err) {
            //console.log('err')
            console.error(err)
          }
        //console.log('Lineup.batchUpdate updateAll')
        //console.log(instance)
        //return instance
        }
      ))
      
    cb(null, 'OK');
    */
    }

    Lineup.remoteMethod('batchUpdate', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        returns: {arg: 'data', type: 'object'},
        http: {path: '/batchUpdate'}
    });

    Lineup.remoteMethod('batchDelete', {
          accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
        returns: {arg: 'data', type: 'object'},
        http: {path: '/batchDelete'}
    });

};

