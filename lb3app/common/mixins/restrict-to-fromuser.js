// common/mixins/restrict-to-fromuser.js


'use strict'


const _ = require('lodash')

module.exports = function byUser(Model, options) {
 
  Model.observe('loaded', function event(ctx, next) {

    // get current user ID
    const viewerId = Model.app.get('ftUserId')
    const admin = Model.app.get('scope') && Model.app.get('scope').includes('admin')



    //console.log('by-user mixin user ' + viewerId)
    //console.log('by-user mixin data ', ctx.data)

    if(admin || ctx.data.fromuser === viewerId || !_.isArray(ctx.data)) return next()
    ctx.data = ctx.data.filter(d => viewerId === d.fromuser)
    

    // next callback in the stack.
    next()
  });
};