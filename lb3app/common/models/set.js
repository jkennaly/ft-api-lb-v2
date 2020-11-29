// set.js

module.exports = function(Set){
  /*
  Set.on('dataSourceAttached', function(obj){
      console.log('Set.deleteById attachment')
    var del = function(id, cb) {
      console.log('Set.deleteById', id)
      Set.update({id: id}, {deleted: true}, cb);
    }
    Set.deleteById = function(id, cb) {
      return del.apply(this, arguments)
    };
  })
*/
  Set.prototype.getFestivalId = function() {
    //console.log('Set.getFestivalId', this.days.get())
    return Set.app.models.Day.findById(this.day)
      .then(day => Set.app.models.Date.findById(day.date))
      .then(date => Set.app.models.Festival.findById(date.festival))
  }
/*
  Set.prototype.getFestivalId = function() {
    return this.day.get()
      .then(day => day.dates.get())
      .then(date => date.festival)
  }
*/

  

  Set.forDay = function(data, dayId, cb) {

    //console.log('Set.forDay')
    //console.log(dayId)
    //console.log(data)

    Promise.all(
        data.artistIds
          .map(artistId => Set.create({band: artistId, user: data.user, day: dayId}))
      )
      .then(() => Set.find({where: {id: {inq: data.artistIds}}}, cb))
      .catch(cb)
}

  
    Set.batchCreate = function(data, cb) {

      //console.log('Set.batchCreate')
      //console.log(data)



      Promise.all(
        data
          //.filter(d => d.id)
          .map(dataEl => Set.create(setData, dataEl))
      )
      .then(() => Set.find({where: {id: {inq: data.map(x => x.id)}}}, cb))
      .catch(cb)


    }
    
    Set.batchDelete = function(data, cb) {

      //console.log('Set.batchDelete')
      //console.log(data)
      Promise.all(
        data.setIds
          .map(id => Set.deleteById(id))
      )
      .then(() => Set.find({where: {id: {inq: data.setIds}}}, cb))
      .catch(cb)

    }

  Set.batchUpdate = function(data, cb) {

    //console.log('Set.batchCreate')
    //console.log(data)

    //add each artist to the forDay

    
  // the files are available as req.files.
  // the body fields are available in req.body
  Promise.all(
        data
          .filter(d => d.id)
          .map(setData => Set.upsertWithWhere({id: setData.id}, setData))
      )
      .then(() => Set.find({where: {id: {inq: data.map(x => x.id)}}}, cb))
      .catch(cb)
  }

  Set.lineupRemove = function(lineup) {

    //console.log('Set.lineupRemove', lineup)

    if(!lineup) return

    //first get the sets for the band
    Set.find({
      where: {
        band: lineup.band
      }
    })
      //.then(sets => console.log(`sets to remove`, sets) || sets)
      //narrow to only sets for the lineup festival
      .then(sets => Promise.all(sets.map(s => Promise.all([s.id, s.getFestivalId()]))))
      .then(setFests => setFests.filter(s => s[1] === lineup.festival))
      .then(setsToRemove => setsToRemove.length && Set.batchDelete({setIds: setsToRemove.map(s => s[0])}, x => {}))
      .catch(err => console.error(err))

  }



  Set.remoteMethod('batchUpdate', {
        accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
      http: {path: '/batchUpdate'},
        returns: {arg: 'data', type: 'object'}
  });
  Set.remoteMethod('forDay', {
        accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } },
      {arg: 'dayId', type: 'number', required: true}],
      http: {path: '/forDay/:dayId'},
        returns: {arg: 'data', type: 'object'}
  });
 Set.remoteMethod('batchCreate', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchCreate'},
        returns: {arg: 'data', type: 'object'}
    });
    Set.remoteMethod('batchDelete', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchDelete'},
        returns: {arg: 'data', type: 'object'}
    });
};

