var assert = require("assert");

var libdir = (process.env.COVERAGE)? "../../lib-cov" : "../../lib";
var shapeways = require(libdir);

suite("Shapeways.Client", function(){
    suite("client.url", function(){
        test("should properly join path with default version and base", function(){
            var client = new shapeways.client();

            var url = client.url("/models/");
            assert.equal(url, "https://api.shapeways.com/models/v1");
        });

        test("should properly join path with overriden version and base", function(){
            var options = {
                baseUrl: "http://example.org/",
                apiVersion: "v2",
            };
            var client = new shapeways.client(options);

            var url = client.url("/models/");
            assert.equal(url, "http://example.org/models/v2");
        });

        test("should properly add bounding slashes to path", function(){
            var client = new shapeways.client();

            var url = client.url("models");
            assert.equal(url, "https://api.shapeways.com/models/v1");
        });

        test("should properly add trailing slash to path", function(){
            var client = new shapeways.client();

            var url = client.url("/models");
            assert.equal(url, "https://api.shapeways.com/models/v1");
        });

        test("should properly add leading slash to path", function(){
            var client = new shapeways.client();

            var url = client.url("models/");
            assert.equal(url, "https://api.shapeways.com/models/v1");
        });

        test("should properly add slashes for multi-part paths", function(){
            var client = new shapeways.client();

            var url = client.url("models/86");
            assert.equal(url, "https://api.shapeways.com/models/86/v1");
        });

        test("should properly add params to path", function(){
            var client = new shapeways.client();

            var params = {
                key: "value",
                id: 86,
            };
            var url = client.url("/models/", params);
            assert.equal(url, "https://api.shapeways.com/models/v1?key=value&id=86");
        });
    });
});
