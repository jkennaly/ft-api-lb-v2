// intention.js

module.exports = function(Intention){

    
    Intention.batchCreate = function(data, cb) {

      //console.log('Intention.batchCreate')
      //console.log(data)


      data.map(elData => Intention.upsertWithWhere({
          subject: elData.subject, 
          subject_type: elData.subjectType, 
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
    
    Intention.batchDelete = function(data, cb) {

      //console.log('Intention.batchDelete')
      //console.log(data)

      data.map(elData => Intention.deleteById(elData,
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

    Intention.remoteMethod('batchCreate', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchCreate'}
    });
    Intention.remoteMethod('batchDelete', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchDelete'}
    });
};

