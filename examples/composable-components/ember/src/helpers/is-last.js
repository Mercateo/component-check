import Ember from '../ember-shim';

export default Ember.Helper.helper(function(params) {
  var length = params[0];
  var index = params[1];

  return length === (index + 1);
});
