module.exports = function( req, res, next, app, settings ) {

  var Promise = require( 'bluebird' );
  var bhttp = require( 'bhttp' );

  if (!req.query.state) {
    req.app.locals.appState = require( 'randomstring' ).generate( 10 );
    res.redirect( `https://www.reddit.com/api/v1/authorize?client_id=${settings.appClientId}&response_type=code&state=${req.app.locals.appState}&redirect_uri=${settings.appRedirectUri}&duration=${settings.appDuration}&scope=${settings.appScope}` );
  } else {
    //Check if empty object is returned in req.query
    if ( Object.keys( req.query ).length === 0 && req.query.constructor === Object ) {
      // Add error page render here later, obvious error since no query string here.
    } else {
      if ( req.app.locals.appState === req.query.state ) {
        var authReq = require( './auth-requests' );

        return Promise.try( () => {
          //Get token access
          return bhttp.post( 'https://www.reddit.com/api/v1/access_token', authReq.getTokenCode( req.query.code ), authReq.getTokenAuthData() );
        }).then( function( postRes ) {
          //Save token for later calls
          req.app.set( 'access_token', postRes.body.access_token );
          //Get users username
          return bhttp.get( 'https://oauth.reddit.com/api/v1/me', authReq.getAuthUserData( req.app.get( 'access_token' ) ) );
        }).then( function( userData ) {
          //Save username
          req.app.set( 'username', userData.body.name );
          res.redirect( '/sort' );
          //Pull first page of saved data
          //return bhttp.get( 'https://oauth.reddit.com/user/' + userData.body.name + '/saved', authReq.getAuthUserData( req.app.get( 'access_token' ) ) );
        });

      } else {
          //error render, state not adding up
      }
    }
  }
}