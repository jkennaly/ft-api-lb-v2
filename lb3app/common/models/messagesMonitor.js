// messagesMonitor.js

module.exports = function(MessagesMonitor){


    
    MessagesMonitor.batchCreate = function(data, cb) {

      //console.log('MessagesMonitor.batchCreate')
      //console.log(data)


      data.map(elData => MessagesMonitor.upsertWithWhere({
          message: elData.message, 
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
    
    MessagesMonitor.batchDelete = function(data, cb) {

      //console.log('MessagesMonitor.batchDelete')
      //console.log(data)

      data.map(elData => MessagesMonitor.deleteById(elData,
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

    MessagesMonitor.remoteMethod('batchCreate', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchCreate'}
    });
    MessagesMonitor.remoteMethod('batchDelete', {
          accepts: [{ arg: 'data', type: 'array', http: { source: 'body' } }],
        http: {path: '/batchDelete'}
    });
};

