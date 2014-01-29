var assert = require("assert");

var oauth = require("oauth");

var libdir = (process.env.COVERAGE)? "../../lib-cov" : "../../lib";
var shapeways = require(libdir);

suite("Shapeways.Client", function(){
    suite("client.connect", function(){
        test("should call client.connection.getOAuthRequestToken", function(done){
            var old_get_request_token = oauth.OAuth.prototype.getOAuthRequestToken;
            oauth.OAuth.prototype.getOAuthRequestToken = function(callback){
                var results = {
                    authentication_url: "http://example.org/auth?oauth_token=some_token",
                };
                callback(null, "token", "secret", results);
            };
            var client = new shapeways.client();

            client.connect(function(error, url){
                assert.equal(url, "http://example.org/auth?oauth_token=some_token");
                assert.equal(client.oauthToken, "token");
                assert.equal(client.oauthSecret, "secret");
                done();
            });

            oauth.OAuth.prototype.getOAuthRequestToken = old_get_request_token;
        });

        test("should get error from client.connection.getOAuthRequestToken", function(done){
            var old_get_request_token = oauth.OAuth.prototype.getOAuthRequestToken;
            oauth.OAuth.prototype.getOAuthRequestToken = function(callback){
                var results = {
                    authentication_url: "http://example.org/auth?oauth_token=some_token",
                };
                callback("my error");
            };
            var client = new shapeways.client();

            client.connect(function(error, url){
                assert.equal(url, undefined);
                assert(error, "my error");
                done();
            });

            oauth.OAuth.prototype.getOAuthRequestToken = old_get_request_token;
        });
    });
});
