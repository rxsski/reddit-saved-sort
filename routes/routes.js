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

  router.get('/sort-app', function(req, res, next) {
    require('../controllers/sort-app.js');
  });

  router.get('/test', function(req, res, next) {
    res.render('sort-app');
  });

  app.use('/', router);
  app.use('/auth', router);
  app.use('/sort-app', router);

  app.use('/test', router);

};