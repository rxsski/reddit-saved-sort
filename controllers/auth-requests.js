module.exports = {

  //Get auth token data to send
  getTokenAuthData: function() {
    var settings = require('../vars.js');

    var params = { 
      headers : {
        'Authorization' : 'Basic ' + new Buffer(settings.appClientId + ':' + settings.appSecret).toString('base64')
      }
    }
    return params;
  },

  //Get token form data to post
  getTokenCode: function(code) {
    var settings = require('../vars.js');

    var formData = {
      'grant_type' : 'authorization_code',
      'code' : code,
      'redirect_uri' : settings.appRedirectUri
    }
    return formData;
  },

  //Get auth user ID info to send
  getAuthUserData: function(token) {
    var settings = require('../vars.js');

    var tokenParams = {
      headers : {
        'Authorization' : `bearer ${token}`,
        'User-Agent' : settings.appUserAgent
      }
    }


    return tokenParams;
  }

  


}