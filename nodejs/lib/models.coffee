### Object representing a model file on Shapeways ###
cfg = require '../cfg/config.js'
Auth = (require './auth.js').Auth
fs = require 'fs'

auth = new Auth

exports.Models = class Models
  getModels: (oauth_access_token, oauth_access_token_secret, callback) ->
    # Note: getModels, getModel should utilize same function with overloaded optional parameter :modelId

    auth.oa.getProtectedResource "http://api.#{cfg.API_SERVER}/models/#{cfg.API_VERSION}", 'GET', oauth_access_token, oauth_access_token_secret, (error, data, response) ->
      if error
        console.log 'error :' + JSON.stringify error

      # Send model list
      callback data

  getModel: (id, oauth_access_token, oauth_access_token_secret, callback) ->
    # Note: getModel should utilize same function with overloaded optional parameter :modelId
    auth.oa.getProtectedResource "http://api.#{cfg.API_SERVER}/models/#{id}/#{cfg.API_VERSION}", 'GET', oauth_access_token, oauth_access_token_secret, (error, data, response) ->
     if error
       console.log 'error :' + JSON.stringify error

     # Send model information
     callback data
  
  putModel: (file, oauth_access_token, oauth_access_token_secret, callback) ->
    # Tests an upload - work in progress
    model_upload = fs.readFile file.path, (err, fileData) -> ##
      fileData = encodeURIComponent fileData.toString('base64')

      upload = JSON.stringify {
        file: fileData,
        fileName: file.name,
        hasRightsToModel: 1,
        acceptTermsAndConditions: 1
      }

      auth.oa.post "http://api.#{cfg.API_SERVER}/models/#{cfg.API_VERSION}", oauth_access_token, oauth_access_token_secret, upload, (error, data, response) ->
        if error
          console.log 'error: ' + JSON.stringify error
          console.log error
          # Redirect to error page?
        else
          # Send model information
          callback data