
define([

  'backbone'

], function(

  Backbone

) {

  /**
   * We alias the `Backbone.Collection` to just `Collection`. Because 
   * we wan't to generalize the constructor name.
   *
   * @constructor Collection
   */

  return Backbone.Collection;

});
