module.exports = function(app, settings) {

  const express = require('express');
  const router = express.Router();

  router.get('/', function(req, res, next) {
    res.render('index');
  });

 //Auth entry point
  router.get('/auth', function(req, res, next) {
    require('../controllers/auth.js')(req, res, next, app, settings);

/*
    if (!req.query.state) {
      console.log("im in auth");
      req.app.locals.appState = require('randomstring').generate(10);
      res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${settings.appClientId}&response_type=code&state=${req.app.locals.appState}&redirect_uri=${settings.appRedirectUri}&duration=${settings.appDuration}&scope=${settings.appScope}`);
    } else {
      console.log("im in the other auth");
      require('../controllers/auth.js')(req, res, next, app, settings);
    }
*/
    
  });

  router.get('/sort-app', function(req, res, next) {
    require('../controllers/sort-app.js');
  });

  router.get('/test', function(req, res, next) {
    res.render('sort-app');
  })

  app.use('/', router);
  app.use('/auth', router);
  app.use('/sort-app', router);

  app.use('/test', router);

};