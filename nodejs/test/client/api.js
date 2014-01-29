var assert = require("assert");

var libdir = (process.env.COVERAGE)? "../../lib-cov" : "../../lib";
var shapeways = require(libdir);

suite("Shapeways.Client", function(){
    suite("client.getApiInfo", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/api/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getApiInfo(function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getCart", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/orders/cart/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getCart(function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.addToCart", function(){
        test("should error when modelId is missing", function(done){
            var client = new shapeways.client();
            var data = {};
            client.addToCart(data, function(error, results){
                assert.equal(typeof(error), "string");
                assert.equal(results, undefined);
                done();
            });
        });

        test("should build the correct url with qs and call client.get", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/orders/cart/v1?modelId=86");
                assert.equal(body, null);
                callback(null, {});
            };

            var client = new shapeways.client();
            var data = {
                modelId: 86,
            };
            client.addToCart(data, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });
    });

    suite("client.getMaterials", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/materials/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getMaterials(function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getMaterial", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/materials/86/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getMaterial(86, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getModel", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModel(86, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getModelInfo", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/info/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModelInfo(86, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getModels", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/v1?");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModels(function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });

        test("should build the correct url with page parameter and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/v1?page=5");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModels(5, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.deleteModel", function(){
        test("should build the correct url and call client.delete", function(done){
            var old_delete = shapeways.client.prototype.delete;
            shapeways.client.prototype.delete = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.deleteModel(86, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.delete = old_delete;
        });
    });

    suite("client.getPrinters", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/printers/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getPrinters(function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getPrinter", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/printers/86/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getPrinter(86, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getCategories", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/categories/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getCategories(function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getCategory", function(){
        test("should build the correct url and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/categories/86/v1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getCategory(86, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.getPrice", function(){
        test("should build the correct url and call client.post", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/price/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                volume: 1,
                area: 2,
                xBoundMin: 2,
                xBoundMax: 3,
                yBoundMin: 2,
                yBoundMax: 3,
                zBoundMin: 2,
                zBoundMax: 3,
            };
            client.getPrice(params, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });

        test("should call get an error with missing params", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/price/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                volume: 1,
                area: 2,
                xBoundMin: 2,
                yBoundMin: 2,
                yBoundMax: 3,
                zBoundMax: 3,
            };
            client.getPrice(params, function(error, results){
                assert.equal(typeof(error), "string");
                assert.equal(results, undefined);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });
    });

    suite("client.addModelFile", function(){
        test("should build the correct url and call client.post", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/files/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                file: "<file data>",
                fileName: "model.ext",
                hasRightsToModel: true,
                acceptTermsAndConditions: true,
            };
            client.addModelFile(86, params, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });

        test("should get error with missing params", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/files/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                file: "<file data>",
                hasRightsToModel: true,
            };
            client.addModelFile(86, params, function(error, results){
                assert.equal(typeof(error), "string");
                assert.equal(results, undefined);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });
    });

    suite("client.addModelPhoto", function(){
        test("should build a correct url and call client.post", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/photos/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                file: "<file data>",
            };
            client.addModelPhoto(86, params, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });

        test("should get error with missing params", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/photos/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {};
            client.addModelPhoto(86, params, function(error, results){
                assert.equal(typeof(error), "string");
                assert.equal(results, undefined);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });
    });

    suite("client.getModelFile", function(){
        test("should build the correct url without includeFile given and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/files/23/v1?file=0");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModelFile(86, 23, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });

        test("should build the correct url with includeFile set to false and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/files/23/v1?file=0");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModelFile(86, 23, false, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });

        test("should build the correct url with includeFile set to true and call client.get", function(done){
            var old_get = shapeways.client.prototype.get;
            shapeways.client.prototype.get = function(url, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/files/23/v1?file=1");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.getModelFile(86, 23, true, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.get = old_get;
        });
    });

    suite("client.updateModelInfo", function(){
        test("should build the correct url and call client.put", function(done){
            var old_put = shapeways.client.prototype.put;
            shapeways.client.prototype.put = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/86/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            client.updateModelInfo(86, {}, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.put = old_put;
        });
    });

    suite("client.addModel", function(){
        test("should build the correct url and call client.post", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                file: "<file data>",
                fileName: "model.ext",
                hasRightsToModel: true,
                acceptTermsAndConditions: true,
            };
            client.addModel(params, function(error, results){
                assert.equal(typeof(results), "object");
                assert.equal(error, null);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });

        test("should get error with missing params", function(done){
            var old_post = shapeways.client.prototype.post;
            shapeways.client.prototype.post = function(url, body, callback){
                assert.equal(url, "https://api.shapeways.com/models/v1");
                assert.equal(typeof(body), "string");
                callback(null, {});
            };

            var client = new shapeways.client();
            var params = {
                file: "<file data>",
                hasRightsToModel: true,
            };
            client.addModel(params, function(error, results){
                assert.equal(typeof(error), "string");
                assert.equal(results, undefined);
                done();
            });

            shapeways.client.prototype.post = old_post;
        });
    });
});
