// artistAlias.js

module.exports = function(ArtistAlias){


    
    ArtistAlias.batchCreate = function(data, cb) {

      //console.log('ArtistAlias.batchCreate')
      //console.log(data)


      data.map(elData => ArtistAlias.upsertWithWhere({
          band: elData.band, 
          alias: elData.alias,
          user: elData.user
        }, 
        elData,
        (err, el) => {
          if(err) {
            //console.log('err')
            console.log(err)
          }
        }
      ))
      

      
    // the files are available as req.files.
    // the body fields are available in req.body
    cb(null, 'OK');
    }
    
    ArtistAlias.batchDelete = function(data, cb) {

      //console.log('ArtistAlias.batchDelete')
      //console.log(data)

      data.map(elData => ArtistAlias.deleteById(elData,
        (err, el) => {
          if(err) {
            //console.log('err')
            console.log(err)
          }
        }
      ))
      

      
    // the files are available as req.files.
    // the body fields are available in req.body
    cb(null, 'OK');
    }

    ArtistAlias.remoteMethod('batchCreate', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchCreate'}
    });
    ArtistAlias.remoteMethod('batchDelete', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchDelete'}
    });
};

