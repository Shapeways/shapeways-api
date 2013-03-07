express = require 'express'
Auth = (require './lib/auth.js').Auth
Models = (require './lib/models.js').Models
cfg = require './cfg/config.js'
  
app = express()
app.use express.bodyParser()
app.use express.cookieParser()
app.use express.session
  secret: 'blahblahblah'  # Random hash for session store
app.set 'views', __dirname + '/views'
app.engine 'jade', require('jade').__express


### Controllers ###

auth = new Auth
models = new Models


### Routes ###      
      
app.get '/', (req, res) ->
  if !isLoggedIn(req.session)
    res.redirect '/login'
  else
    # User is already auth'd in and should be taken to their models
    res.redirect '/models'
    

app.get '/login', (req, res) ->
  # Allow user to login using Shapeways and collect request token
  auth.login (error, callback) ->
    # Store oauth_token + secret in session
    req.session.oauth_token = callback.oauth_token
    req.session.oauth_token_secret = callback.oauth_token_secret
    res.redirect callback.url
  
app.get '/callback', (req, res) ->
  # Grab the OAuth access token and store it in session
  auth.handleCallback req.query.oauth_token, req.session.oauth_token_secret, req.query.oauth_verifier, (callback) ->
    # Store oauth_access_token + secret in session
    req.session.oauth_access_token = callback.oauth_access_token
    req.session.oauth_access_token_secret = callback.oauth_access_token_secret
    res.redirect '/' # Send the access token to the browser

app.get '/upload', (req, res) ->
  if !isLoggedIn(req.session)
    res.redirect '/login'
  else
    # Display file upload dialog
    res.render 'models/upload.jade'

app.post '/models/upload', (req, res) ->
  # Process model upload
  if !isLoggedIn(req.session)
    res.redirect '/login'
  else
    # Upload a model
    models.putModel req.files.modelUpload, req.session.oauth_access_token, req.session.oauth_access_token_secret, (callback) ->
      res.render 'models/upload_success.jade', { "callback": JSON.parse(callback), "server": cfg.API_SERVER }
      
app.get '/models/:id', (req, res) ->
  if !isLoggedIn(req.session)
    res.redirect '/login'
  else
    # Display a list of user's models

    models.getModel req.params.id, req.session.oauth_access_token, req.session.oauth_access_token_secret, (callback) ->
      if isJson req.url
        res.send JSON.parse callback
      else
        res.render 'models/id.jade', { "callback": JSON.parse(callback), "server": cfg.API_SERVER  }

app.get '/models*', (req, res) ->
  if !isLoggedIn(req.session)
    res.redirect '/login'
  else
    # Display a list of user's models
    models.getModels req.session.oauth_access_token, req.session.oauth_access_token_secret, (callback) ->
      if isJson req.url
        res.send JSON.parse callback
      else
        res.render 'models/index.jade', { "callback": JSON.parse callback }
      



app.get '/logout', (req, res) ->
  # Allow the user to logout (clear local cookies)
  req.session.destroy()
  res.redirect '/'  

### Start the App ###

app.listen '3000'


isLoggedIn = (session) ->
  if !session.oauth_access_token
    # User doesn't have any session data and therefore is not already logged in
    return false
  return true
        
isJson = (url) ->
  json = false
  if (url.substring url.length-5) == ".json"
    json = true
  return json
      
