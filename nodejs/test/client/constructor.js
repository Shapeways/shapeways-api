var assert = require("assert");

var libdir = (process.env.COVERAGE)? "../../lib-cov" : "../../lib";
var shapeways = require(libdir);

suite("Shapeways.Client", function(){
    suite("new client()", function(){
        test("should create client without new keyword", function(){
            var client = shapeways.client();
            assert(typeof client, "object");
            assert(client instanceof shapeways.client);
        });

        test("should create client without any options", function(){
            var client = new shapeways.client();
            assert(typeof client, "object");
            assert(client instanceof shapeways.client);
            assert.equal(client.consumerKey, undefined);
            assert.equal(client.consumerSecret, undefined);
            assert.equal(client.authorizationCallback, null);
            assert.equal(client.baseUrl, "https://api.shapeways.com");
            assert.equal(client.apiVersion, "v1");
            assert(typeof client.connection, "object");
        });

        test("options should override defaults", function(){
            var options = {
                baseUrl: "http://example.org",
                consumerKey: "my-key",
                consumerSecret: "my-secret",
                authorizationCallback: "http://localhost:3000/callback",
                apiVersion: "v2",
            };
            var client = new shapeways.client(options);
            for(var property in options){
                assert.equal(options[property], client[property]);
            }

        });

        test("should remove trailing slash from baseUrl", function(){
            var options = {
                baseUrl: "http://example.org/",
            };
            var client = new shapeways.client(options);
            assert.equal(client.baseUrl, "http://example.org");
        });

        test("should call connect when passed a callback", function(done){
            var old_connect = shapeways.client.prototype.connect;
            shapeways.client.prototype.connect = function(callback){
                callback(10);
            };
            var client = new shapeways.client({}, function(id){
                assert.equal(id, 10);
                done();
            });

            shapeways.client.prototype.connect = old_connect;
        });

        test("should call connect when passed a callback and no options", function(done){
            var old_connect = shapeways.client.prototype.connect;
            shapeways.client.prototype.connect = function(callback){
                callback(12);
            };
            var client = new shapeways.client(function(id){
                assert.equal(id, 12);
                done();
            });

            shapeways.client.prototype.connect = old_connect;
        });
    });
});
