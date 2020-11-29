// common/mixins/creatorstamp.js


'use strict';


const _ = require('lodash');

module.exports = function creatorstamp(Model, options) {
 
  Model.observe('before save', function event(ctx, next) {

    // get current user ID
    const authorId = Model.app.get('ftUserId');

    //console.log('userstamp mixin user ' + authorId)
    if (ctx.instance) {
    //console.log('userstamp mixin ctx.instance ')
        ctx.instance.creator = authorId;
      } else if(ctx.data) {
    //console.log('userstamp mixin ctx.data ')
        ctx.data.creator = authorId;
      }


    // next callback in the stack.
    next();
  });
};