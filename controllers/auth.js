module.exports = function(req, res, next, app, settings) {

  var Promise = require('bluebird');
  var bhttp = require('bhttp');

  if (!req.query.state) {
    req.app.locals.appState = require('randomstring').generate(10);
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${settings.appClientId}&response_type=code&state=${req.app.locals.appState}&redirect_uri=${settings.appRedirectUri}&duration=${settings.appDuration}&scope=${settings.appScope}`);
  } else {
    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
      // Add error page render here later
    } else {
      if (req.app.locals.appState === req.query.state) {
        var authReq = require('./auth-requests');

        console.log('starting promise');

        return Promise.try(() => {
          //Get token access
          return bhttp.post('https://www.reddit.com/api/v1/access_token', authReq.getTokenCode(req.query.code), authReq.getTokenAuthData());
        }).then(function(postRes) {
          //Get users username
          return bhttp.get('https://oauth.reddit.com/api/v1/me', authReq.getAuthUserData(postRes.body.access_token))
        }).then(function(userData) {
          //At moment, userData only contains the JSON data for one page, 
          //TODO :: change to collect data from entire account
          req.app.set('userData', userData);
          //console.log(bleh);
          //console.log(bleh.body.toString());
          //res.send(bleh.body.toString());
        });

        //var gotIt = new Promise(function(resolve, reject){
          //request(authReq.getTokenData(req.query.code), resolve);
        //}).then(function(res){
        //request(authRequest.getAuthUserData, )
        //})
        //var token = authReq.getToken(req.query.code);
        //var name = authReq.getAuthUser(token);
       // console.log(name, ' NAME HERE');
          //func(req.query.code);
          /*
          console.log(req);

          var codeToken = {
                'grant_type' : 'authorization_code',
                'code' : req.query.code,
                'redirect_uri' : settings.appRedirectUri
              }
              var params = {
                uri : 'https://www.reddit.com/api/v1/access_token',
                method : 'POST',
                form : codeToken,
                auth : {
                  user : settings.appClientId,
                  pass : settings.appSecret
                },
                json : true
              }
          // First post, get auth token
          request(params, function(authError, authResponse, authBody) {

            var tokenParams = {
              uri : 'https://oauth.reddit.com/user/rxsski/saved',
              method : 'GET',
              headers : {
              'Authorization': `bearer ${authBody.access_token}`,
              'User-Agent': settings.appUserAgent
              }
            }

            // Now make req for saved info
            request(tokenParams, function(tokenError, tokenResponse, tokenBody) {

              var redditResponse = JSON.parse(tokenBody);
              res.send(redditResponse.data.children);

            });
          });
          */
      } else {
          //error render, state not adding up
      }
    }
  }
}