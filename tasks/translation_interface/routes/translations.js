var routes = function(server) {

  'use strict';

  // DOM appending
  server.get( '/friends', function(req, res) {
    return res.send( 'document.innerHTML' );
  });

};

module.exports = routes;
