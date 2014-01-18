var assert = require("assert");

var oauth = require("oauth");

var libdir = (process.env.COVERAGE)? "../../lib-cov" : "../../lib";
var shapeways = require(libdir);

suite("Shapeways.Client", function(){
    suite("client.verifyUrl", function(){
        test("should work with invalid url", function(done){
            var old_verify = shapeways.client.prototype.verify;
            shapeways.client.prototype.verify = function(token, verifier, callback){
                assert.equal(token, undefined);
                assert.equal(verifier, undefined);
                done();
            };

            var client = new shapeways.client();
            client.verifyUrl("not a real url");

            shapeways.client.prototype.verify = old_verify;
        });

        test("should work with no query string", function(done){
            var old_verify = shapeways.client.prototype.verify;
            shapeways.client.prototype.verify = function(token, verifier, callback){
                assert.equal(token, undefined);
                assert.equal(verifier, undefined);
                done();
            };

            var client = new shapeways.client();
            client.verifyUrl("http://example.org?");

            shapeways.client.prototype.verify = old_verify;
        });

        test("should work with incorrect query string parameters", function(done){
            var old_verify = shapeways.client.prototype.verify;
            shapeways.client.prototype.verify = function(token, verifier, callback){
                assert.equal(token, undefined);
                assert.equal(verifier, undefined);
                done();
            };

            var client = new shapeways.client();
            client.verifyUrl("http://example.org?token=some-token&verifier=some-verifier");

            shapeways.client.prototype.verify = old_verify;
        });

        test("should work with correct query string parameters", function(done){
            var old_verify = shapeways.client.prototype.verify;
            shapeways.client.prototype.verify = function(token, verifier, callback){
                assert.equal(token, "some-token");
                assert.equal(verifier, "some-verifier");
                done();
            };

            var client = new shapeways.client();
            client.verifyUrl("http://example.org?oauth_token=some-token&oauth_verifier=some-verifier");

            shapeways.client.prototype.verify = old_verify;
        });
    });

    suite("client.verify", function(){
        test("should call client.connection.getOAuthAccessToken", function(done){
            var old_get_access_token = oauth.OAuth.prototype.getOAuthAccessToken;
            oauth.OAuth.prototype.getOAuthAccessToken = function(token, secret, verifier, callback){
                callback(null, "some-token", "some-secret", {});
            };

            var client = new shapeways.client();
            client.verify("token", "verifier", function(error){
                assert.equal(client.oauthToken, "some-token");
                assert.equal(client.oauthSecret, "some-secret");
                done();
            });

            oauth.OAuth.prototype.getOAuthAccessToken = old_get_access_token;
        });

        test("should get error from client.connection.getOAuthAccessToken", function(done){
            var old_get_access_token = oauth.OAuth.prototype.getOAuthAccessToken;
            oauth.OAuth.prototype.getOAuthAccessToken = function(token, secret, verifier, callback){
                callback("oh no, error!");
            };

            var client = new shapeways.client();
            client.verify("token", "verifier", function(error){
                assert.equal(error, "oh no, error!");
                assert.equal(client.oauthToken, undefined);
                assert.equal(client.oauthSecret, undefined);
                done();
            });

            oauth.OAuth.prototype.getOAuthAccessToken = old_get_access_token;
        });
    });
});
