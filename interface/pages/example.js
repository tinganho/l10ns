
module.exports = function(page) {

  /**
   * Router with
   */

  page('/home')

    /**
     * Document is not shared in the client side. If any document
     * is changed on the client it needs to make a new page request.
     * For that reason we can have state on the document
     */

    .document('default', function(req, next) {
      // Request object is provided to get the state
      // Call next when you got the state
      next({
        title : 'some-title',
        description : 'some-description',
        style : 'path/to/some/style',
        main : 'some-main', // Requirejs main
        outputRouter : 'path/to/output/file'// We build one router file
      });
    })

    /**
     * All layouts need to be static. If something is not stateless
     * than it is a module.
     */

    .layout('one-column')

    .content({
      'feed-container' : {
        // You need to override backbone sync to get/set state. The request
        // object provided is in opts parameter in sync(method, model, opts)
        //
        // Example :
        //
        //   sync :function(method, model, opts) {
        //     if(method === 'get') {
        //       var accessToken = opts.req.param('access-token');
        //       // Do something
        //     }
        //   }
        //
        model : './Feed',
        view : './FeedView'
      },
      'menu-container' : {
        model : './Menu',
        view : './MenuView'
      }
    })

    .fail(function(err) {
      // Do something if it fails
    });
};
