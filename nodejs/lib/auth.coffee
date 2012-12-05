### Handle authentication of users via Shapeways ###
cfg = require '../cfg/config.js'
OAuth = (require 'oauth').OAuth

exports.Auth = class Auth
  constructor: ->
    # Generate oauth object
    @oa = oa = new OAuth cfg.REQUEST_TOKEN_URL, cfg.ACCESS_TOKEN_URL, cfg.CUSTOMER_KEY, cfg.CUSTOMER_SECRET, '1.0', cfg.CALLBACK_URL, 'HMAC-SHA1'
    
  login: (callback) ->
    console.log 'Getting OAuth Request Token'
    @oa.getOAuthRequestToken (error, oauth_token, oauth_token_secret, results) ->
      if error
        console.log 'error :' + JSON.stringify error
      
      console.log results
      url = results.authentication_url

      callback { oauth_token, oauth_token_secret, url }

  handleCallback:  (oauth_token, oauth_token_secret, oauth_verifier, callback) ->
    # Grab Access Token
    @oa.getOAuthAccessToken oauth_token, oauth_token_secret, oauth_verifier, (error, oauth_access_token, oauth_access_token_secret, response) ->
      if error
        console.log 'error :' + JSON.stringify error
      if response is undefined
        console.log 'error: ' + response
        
      callback { oauth_access_token, oauth_access_token_secret }

  