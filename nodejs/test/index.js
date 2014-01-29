var assert = require("assert");

var libdir = (process.env.COVERAGE)? "../lib-cov" : "../lib";

suite("Shapeways", function(){
    test("should properly import shapeways.client", function(){
        var shapeways = require(libdir);
        assert("client" in shapeways);
        assert.equal(typeof shapeways.client, "function");
    });
});
