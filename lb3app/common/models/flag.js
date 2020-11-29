// flag.js

module.exports = function(Flag){



    Flag.advance = function(flagId, msg, cb) {
    	Flag.findById(flagId)
    		.then(flag => {
    			const advancerId = Flag.app.get('ftUserId')
    			const advancerIsOriginator = advancerId === flag.fromuser
    			const advancerIsAdmin = Flag.app.get('scope').includes('admin')
    			const updatedContent = [3, 5].includes(flag.status) && advancerIsOriginator ? `${flag.content}\n${(new Date()).toUTCString()}: ${msg.msg}` : flag.content
    			const updatedResponse = [1, 2, 5].includes(flag.status) && advancerIsAdmin ? `${flag.response}\n${(new Date()).toUTCString()}: ${msg.msg}` : flag.response

    			const statusChangeOk = [1, 2, 5].includes(flag.status) && advancerIsAdmin ||
    				[3, 5].includes(flag.status) && advancerIsOriginator
    			if(!statusChangeOk) {
    				var error = {
    					message: "Cannot modify this resource",
						status: 403
					}
					return cb(error);
    			}
    			const nextStatus = flag.status === 1 ? 2 :
    				flag.status === 2 ? 3 :
    				flag.status === 3 && /d1scussion/i.test(msg.msg) ? 5 :
    				flag.status === 3 ? 4 :
    				flag.status === 5 && advancerIsOriginator ? 4 :
    				flag.status === 5 && advancerIsAdmin ? 6 :
    				0
    			if(!nextStatus) {
    				var error = {
    					message: "Cannot modify this resource",
						status: 403
					}
					return cb(error);
    			}

    			flag.updateAttributes({
    				content: updatedContent,
    				response: updatedResponse,
    				status: nextStatus
    			}, cb)
    		}
    			)
    		.catch(cb)
    }

    Flag.remoteMethod('advance', {
        accepts: [
        	{arg: 'flagId', type: 'number', required: true},
        	{arg: 'msg', type: 'object', http: { source: 'body' } }
        ],
        returns: {arg: 'data', type: 'object'},
      	http: {path: '/advance/:flagId'}
    });
};

