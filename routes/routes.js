module.exports = function(app, settings) {

  const express = require('express');
  const router = express.Router();

  router.get('/', function(req, res, next) {
    res.render('index');
  });

 //Auth entry point; Get reddit auth, then start app
  router.get('/auth', function(req, res, next) {
    require('../controllers/auth.js')(req, res, next, app, settings);
  });

  router.get('/sort', function(req, res, next) {
    //TODO: make sure the vars below are there, otherwise throw err/redirect
    /*
    var locals = {
      accessToken: req.app.get( 'access_token' ),
      username: req.app.get( 'username' )
    }

    res.render( 'sort-app', locals );
    */
    require( '../controllers/sort.js' )( req, res, next, app, settings );
  });

  app.use('/', router);
  app.use('/auth', router);
  app.use('/sort', router);

};