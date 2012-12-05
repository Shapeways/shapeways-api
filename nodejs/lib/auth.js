// Generated by CoffeeScript 1.4.0

/* Handle authentication of users via Shapeways
*/


(function() {
  var Auth, OAuth, cfg;

  cfg = require('../cfg/config.js');

  OAuth = (require('oauth')).OAuth;

  exports.Auth = Auth = (function() {

    function Auth() {
      var oa;
      this.oa = oa = new OAuth(cfg.REQUEST_TOKEN_URL, cfg.ACCESS_TOKEN_URL, cfg.CUSTOMER_KEY, cfg.CUSTOMER_SECRET, '1.0', cfg.CALLBACK_URL, 'HMAC-SHA1');
    }

    Auth.prototype.login = function(callback) {
      console.log('Getting OAuth Request Token');
      return this.oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        var url;
        if (error) {
          console.log('error :' + JSON.stringify(error));
        }
        console.log(results);
        url = results.authentication_url;
        return callback({
          oauth_token: oauth_token,
          oauth_token_secret: oauth_token_secret,
          url: url
        });
      });
    };

    Auth.prototype.handleCallback = function(oauth_token, oauth_token_secret, oauth_verifier, callback) {
      return this.oa.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier, function(error, oauth_access_token, oauth_access_token_secret, response) {
        if (error) {
          console.log('error :' + JSON.stringify(error));
        }
        if (response === void 0) {
          console.log('error: ' + response);
        }
        return callback({
          oauth_access_token: oauth_access_token,
          oauth_access_token_secret: oauth_access_token_secret
        });
      });
    };

    return Auth;

  })();

}).call(this);
