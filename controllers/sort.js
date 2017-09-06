var _ = require( 'lodash' );
var Promise = require( 'bluebird' );
var bhttp = require( 'bhttp' );

module.exports = function( req, res, next, app, settings ) {
  var aggregateLinkData = [];

  var authReq = require( './auth-requests' );
  var username = req.app.get( 'username' );
  var fields = [ 'subreddit', 'id', 'title', 'over_18', 'subreddit_id', 'name', 'permalink', 'locked', 'created', 'created_utc', 'url', 'author', 'num_comments' ];


  function getSavedData( isFirstPull, currentCount, afterLink ) {
    return Promise.try( () => {
      if( isFirstPull ) {
        return bhttp.get( 'https://oauth.reddit.com/user/' + username + '/saved/?limit=100', authReq.getAuthUserData( req.app.get( 'access_token' ) ) );        
      } else {
        return bhttp.get( 'https://oauth.reddit.com/user/' + username + '/saved/?count=' + currentCount + '&after=' + afterLink + '&limit=100', authReq.getAuthUserData( req.app.get( 'access_token' ) ) );        
      }
    }).then( function( results ) {
      let linkData = filterData( results.body.data.children, fields );
      aggregateLinkData.push(linkData);
      return { after: results.body.data.after };
    });
  }

  function grabAllData( isFirstTime, count, after ) {
    function checkIfMoreDataToGet( dataset ) {
      if( dataset.after !== null ) {
        return grabAllData( false, count + 100, dataset.after );
      }
    }
    return getSavedData( isFirstTime, count, after ).then( checkIfMoreDataToGet );
  }

  grabAllData( true, 0, null )
  .then( function( result ) {
    res.send(aggregateLinkData);
  });

}


function filterData( dataToFilter, fieldsToGet ) {
  var filteredArray1 = [];
  var filteredArray2 = [];

  dataToFilter.forEach( function( obj1 ) {
    filteredArray1.push( _.pick( obj1, [ 'data' ] ) );
  });

  filteredArray1.forEach( function( obj2 ) {
    filteredArray2.push( _.pick( obj2.data, fieldsToGet ) );
  });

  return filteredArray2;
}