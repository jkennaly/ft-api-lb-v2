// common/mixins/futureArtists.js



'use strict';


const _ = require('lodash');

module.exports = function byUser(Model, options) {
 
  Model.observe('access', function event(ctx, next) {

    // get current user ID
    const authorId = Model.app.get('ftUserId');

    //console.log('by-user mixin user ' + authorId)
    //console.log('by-user mixin query ')
    //console.log(ctx.query)

    const newFilter = {user: authorId}

    ctx.query.where = ctx.query.where ? ctx.query.where : {}
    const currentKeys = _.keys(ctx.query.where)

    if(!currentKeys) {
    	ctx.query.where = newFilter
    } else {
    	if()
    	ctx.query.where = {and:[newFilter, ctx.query.where]}
    }


    // next callback in the stack.
    next();
  });
};