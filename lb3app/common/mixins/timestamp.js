// common/mixins/userstamp.js


'use strict';


const _ = require('lodash');

module.exports = function userstamp(Model, options) {
 
  Model.observe('before update', function event(ctx, next) {


    //console.log('userstamp mixin user ' + authorId)
    if (ctx.instance) {
    //console.log('userstamp mixin ctx.instance ')
        ctx.instance.timestamp = new Date()
      } else if(ctx.data) {
    //console.log('userstamp mixin ctx.data ')
        ctx.data.timestamp = new Date()
      }


    // next callback in the stack.
    next();
  });
  Model.observe('before save', function event(ctx, next) {


    //console.log('userstamp mixin user ' + authorId)
    if (ctx.instance) {
    //console.log('userstamp mixin ctx.instance ')
        ctx.instance.timestamp = new Date()
      } else if(ctx.data) {
    //console.log('userstamp mixin ctx.data ')
        ctx.data.timestamp = new Date()
      }


    // next callback in the stack.
    next();
  });
};