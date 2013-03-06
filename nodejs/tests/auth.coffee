### Tests for Auth /lib/auth.coffee ###

cfg = require '../cfg/config.js'
should = require 'should'

authClass = (require '../lib/auth.js').Auth
auth = new authClass cfg

describe "Testing login", ->

  serverName = process.env.API_SERVER

  it "Should login successfully", (done) ->
    auth.login (error, callback) -> 
      should.not.exist error
      callback.should.have.property('url')
      index = callback.url.indexOf(serverName)
      index.should.be.above(-1)
      done()