var assert = require("assert");

var oauth = require("oauth");

var libdir = (process.env.COVERAGE)? "../../lib-cov" : "../../lib";
var shapeways = require(libdir);

suite("Shapeways.Client", function(){
    suite("client.get", function(){
        test("should get error when no oauthToken is set", function(done){
            var client = new shapeways.client();
            client.oauthToken = null;
            client.get("http://example.org/test", function(error, result){
                assert.notEqual(error, null);
                assert.notEqual(error, undefined);
                assert(typeof(error), "string");
                done();
            });
        });

        test("should call client.connection.get", function(done){
            var old_get = oauth.OAuth.prototype.get;
            oauth.OAuth.prototype.get = function(url, token, secret, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                callback(null, "{}");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.get("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.equal(typeof(results), "object");
                done();
            });
            oauth.OAuth.prototype.get = old_get;
        });

        test("should get error from client.connection.get", function(done){
            var old_get = oauth.OAuth.prototype.get;
            oauth.OAuth.prototype.get = function(url, token, secret, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                callback("an error");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.get("http://example.org/test", function(error, results){
                assert.equal(error, "an error");
                assert.equal(results, undefined);
                done();
            });
            oauth.OAuth.prototype.get = old_get;
        });

        test("should properly parse result from client.connection.get", function(done){
            var old_get = oauth.OAuth.prototype.get;
            oauth.OAuth.prototype.get = function(url, token, secret, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                callback(null, '{"key":"value"}');
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.get("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.deepEqual(results, {key: "value"});
                done();
            });
            oauth.OAuth.prototype.get = old_get;
        });
    });

    suite("client.delete", function(){
        test("should get error when no oauthToken is set", function(done){
            var client = new shapeways.client();
            client.oauthToken = null;
            client.delete("http://example.org/test", function(error, result){
                assert.notEqual(error, null);
                assert.notEqual(error, undefined);
                assert(typeof(error), "string");
                done();
            });
        });

        test("should call client.connection.delete", function(done){
            var old_delete = oauth.OAuth.prototype.delete;
            oauth.OAuth.prototype.delete = function(url, token, secret, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                callback(null, "{}");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.delete("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.equal(typeof(results), "object");
                done();
            });
            oauth.OAuth.prototype.delete = old_delete;
        });

        test("should get error from client.connection.delete", function(done){
            var old_delete = oauth.OAuth.prototype.delete;
            oauth.OAuth.prototype.delete = function(url, token, secret, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                callback("an error");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.delete("http://example.org/test", function(error, results){
                assert.equal(error, "an error");
                assert.equal(results, undefined);
                done();
            });
            oauth.OAuth.prototype.delete = old_delete;
        });

        test("should properly parse result from client.connection.delete", function(done){
            var old_delete = oauth.OAuth.prototype.delete;
            oauth.OAuth.prototype.delete = function(url, token, secret, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                callback(null, '{"key":"value"}');
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.delete("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.deepEqual(results, {key: "value"});
                done();
            });
            oauth.OAuth.prototype.delete = old_delete;
        });
    });

    suite("client.post", function(){
        test("should get error when no oauthToken is set", function(done){
            var client = new shapeways.client();
            client.oauthToken = null;
            client.post("http://example.org/test", function(error, result){
                assert.notEqual(error, null);
                assert.notEqual(error, undefined);
                assert(typeof(error), "string");
                done();
            });
        });

        test("should get error when no oauthToken is set, with body", function(done){
            var client = new shapeways.client();
            client.oauthToken = null;
            client.post("http://example.org/test", "some body", function(error, result){
                assert.notEqual(error, null);
                assert.notEqual(error, undefined);
                assert(typeof(error), "string");
                done();
            });
        });

        test("should call client.connection.post", function(done){
            var old_post = oauth.OAuth.prototype.post;
            oauth.OAuth.prototype.post = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, null);
                callback(null, "{}");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.post("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.equal(typeof(results), "object");
                done();
            });
            oauth.OAuth.prototype.post = old_post;
        });

        test("should call client.connection.post with body", function(done){
            var old_post = oauth.OAuth.prototype.post;
            oauth.OAuth.prototype.post = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, '{"nice":"body"}');
                callback(null, "{}");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.post("http://example.org/test", '{"nice":"body"}', function(error, results){
                assert.equal(error, null);
                assert.equal(typeof(results), "object");
                done();
            });
            oauth.OAuth.prototype.post = old_post;
        });

        test("should get error from client.connection.post", function(done){
            var old_post = oauth.OAuth.prototype.post;
            oauth.OAuth.prototype.post = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, null);
                callback("an error");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.post("http://example.org/test", function(error, results){
                assert.equal(error, "an error");
                assert.equal(results, undefined);
                done();
            });
            oauth.OAuth.prototype.post = old_post;
        });

        test("should properly parse result from client.connection.post", function(done){
            var old_post = oauth.OAuth.prototype.post;
            oauth.OAuth.prototype.post = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, null);
                callback(null, '{"key":"value"}');
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.post("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.deepEqual(results, {key: "value"});
                done();
            });
            oauth.OAuth.prototype.post = old_post;
        });

    });

    suite("client.put", function(){
        test("should get error when no oauthToken is set", function(done){
            var client = new shapeways.client();
            client.oauthToken = null;
            client.put("http://example.org/test", function(error, result){
                assert.notEqual(error, null);
                assert.notEqual(error, undefined);
                assert(typeof(error), "string");
                done();
            });
        });

        test("should get error when no oauthToken is set, with body", function(done){
            var client = new shapeways.client();
            client.oauthToken = null;
            client.put("http://example.org/test", "some body", function(error, result){
                assert.notEqual(error, null);
                assert.notEqual(error, undefined);
                assert(typeof(error), "string");
                done();
            });
        });

        test("should call client.connection.put", function(done){
            var old_put = oauth.OAuth.prototype.put;
            oauth.OAuth.prototype.put = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, null);
                callback(null, "{}");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.put("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.equal(typeof(results), "object");
                done();
            });
            oauth.OAuth.prototype.put = old_put;
        });

        test("should call client.connection.put with body", function(done){
            var old_put = oauth.OAuth.prototype.put;
            oauth.OAuth.prototype.put = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, '{"nice":"body"}');
                callback(null, "{}");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.put("http://example.org/test", '{"nice":"body"}', function(error, results){
                assert.equal(error, null);
                assert.equal(typeof(results), "object");
                done();
            });
            oauth.OAuth.prototype.put = old_put;
        });

        test("should get error from client.connection.put", function(done){
            var old_put = oauth.OAuth.prototype.put;
            oauth.OAuth.prototype.put = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, null);
                callback("an error");
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.put("http://example.org/test", function(error, results){
                assert.equal(error, "an error");
                assert.equal(results, undefined);
                done();
            });
            oauth.OAuth.prototype.put = old_put;
        });

        test("should properly parse result from client.connection.put", function(done){
            var old_put = oauth.OAuth.prototype.put;
            oauth.OAuth.prototype.put = function(url, token, secret, body, callback){
                assert.equal(url, "http://example.org/test");
                assert.equal(token, "token");
                assert.equal(secret, "secret");
                assert.equal(body, null);
                callback(null, '{"key":"value"}');
            };

            var client = new shapeways.client();
            client.oauthToken = "token";
            client.oauthSecret = "secret";
            client.put("http://example.org/test", function(error, results){
                assert.equal(error, null);
                assert.deepEqual(results, {key: "value"});
                done();
            });
            oauth.OAuth.prototype.put = old_put;
        });

    });
});
