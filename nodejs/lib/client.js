var querystring = require("querystring");

var oauth = require("oauth");

var client = function(options, callback){
    if(!(this instanceof client)){
        return new client(options, callback);
    }
    if(typeof(options) == "function"){
        callback = options;
        options = {};
    }
    options = options || {};
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.oauthToken = null;
    this.oauthSecret = null;
    this.authorizationCallback = options.authorizationCallback || null;
    this.baseUrl = options.baseUrl || "https://api.shapeways.com";
    this.apiVersion = options.apiVersion || "v1";

    // Remove trailing slash from baseUrl
    this.baseUrl = this.baseUrl.replace(/\/$/, "");

    this.connection = new oauth.OAuth(
        this.url("/oauth1/request_token/"),
        this.url("/oauth1/access_token/"),
        this.consumerKey,
        this.consumerSecret,
        "1.0A",
        this.authorizationCallback,
        "HMAC-SHA1"
    );

    if(typeof(callback) == "function"){
        this.connect(callback);
    }
};

client.prototype.url = function(path, params){
    if(path.indexOf("/") !== 0){
        path = "/" + path;
    }

    if(path.indexOf("/", path.length - 1) === -1){
        path += "/";
    }

    var url = this.baseUrl + path + this.apiVersion;
    if(params){
        url += "?" + querystring.stringify(params);
    }
    return url;
};

client.prototype.connect = function(callback){
    var self = this;
    if(typeof(callback) != "function"){
        callback = function(){};
    }
    this.connection.getOAuthRequestToken(function(error, token, secret, results){
        if(error){
            return callback(error, null);
        }

        self.oauthToken = token;
        self.oauthSecret = secret;
        callback(null, results.authentication_url);
    });
};

client.prototype.verifyUrl = function(url, callback){
    var query = querystring.parse(url.split("?", 2)[1]);
    return this.verify(query.oauth_token, query.oauth_verifier, callback);
};

client.prototype.verify = function(token, verifier, callback){
    if(typeof(callback) != "function"){
        callback = function(){};
    }

    var self = this;
    this.connection.getOAuthAccessToken(token, this.oauthSecret, verifier, function(error, token, secret, results){
        if(error){
            return callback(error);
        }

        self.oauthToken = token;
        self.oauthSecret = secret;
        callback(null);
    });
};

client.prototype.get = function(url, callback){
    if(!callback){
        callback = function(){};
    }

    if(!this.oauthToken){
        return callback("no oauth token, make sure to call client.connect and client.verify");
    }

    this.connection.get(url, this.oauthToken, this.oauthSecret, function(error, data, result){
        if(error){
            return callback(error);
        }

        callback(null, JSON.parse(data));
    });
};

client.prototype.delete = function(url, callback){
    if(!callback){
        callback = function(){};
    }

    if(!this.oauthToken){
        return callback("no oauth token, make sure to call client.connect and client.verify");
    }

    this.connection.delete(url, this.oauthToken, this.oauthSecret, function(error, data, result){
        if(error){
            return callback(error);
        }

        callback(null, JSON.parse(data));
    });
};

client.prototype.post = function(url, body, callback){
    if(typeof(body) == "function"){
        callback = body;
        body = null;
    }

    if(!callback){
        callback = function(){};
    }

    if(!this.oauthToken){
        return callback("no oauth token, make sure to call client.connect and client.verify");
    }

    this.connection.post(url, this.oauthToken, this.oauthSecret, body, function(error, data, result){
        if(error){
            return callback(error);
        }

        callback(null, JSON.parse(data));
    });
};

client.prototype.put = function(url, body, callback){
    if(typeof(body) == "function"){
        callback = body;
        body = null;
    }

    if(!callback){
        callback = function(){};
    }

    if(!this.oauthToken){
        return callback("no oauth token, make sure to call client.connect and client.verify");
    }

    this.connection.put(url, this.oauthToken, this.oauthSecret, body, function(error, data, result){
        if(error){
            return callback(error);
        }

        callback(null, JSON.parse(data));
    });
};

client.prototype.getApiInfo = function(callback){
    this.get(this.url("/api/"), callback);
};

client.prototype.getCart = function(callback){
    this.get(this.url("/orders/cart/"), callback);
};

client.prototype.addToCart = function(params, callback){
    if(!params.modelId){
        return callback("params is missing required modelId parameter");
    }

    this.post(this.url("/orders/cart/", params), null, callback);
};

client.prototype.getMaterial = function(materialId, callback){
    this.get(this.url("/materials/" + materialId), callback);
};

client.prototype.getMaterials = function(callback){
    this.get(this.url("/materials/"), callback);
};

client.prototype.getModels = function(page, callback){
    var params = {};
    if(typeof(page) == "function"){
        callback = page;
        page = null;
    }

    if(page){
        params = {page: page};
    }
    this.get(this.url("/models/", params), callback);
};

client.prototype.getModel = function(modelId, callback){
    this.get(this.url("/models/" + modelId), callback);
};

client.prototype.addModel = function(params, callback){
    var required = ["file", "fileName", "hasRightsToModel", "acceptTermsAndConditions"];
    var missing = [];
    required.forEach(function(property){
        if(!(property in params)){
            missing.push(property);
        }
    });
    if(missing.length){
        return callback("error, params missing required parameters: " + missing);
    }

    this.post(this.url("/models/"), JSON.stringify(params), callback);
};

client.prototype.getModelInfo = function(modelId, callback){
    this.get(this.url("/models/" + modelId + "/info/"), callback);
};

client.prototype.deleteModel = function(modelId, callback){
    this.delete(this.url("/models/" + modelId), callback);
};

client.prototype.updateModelInfo = function(modelId, params, callback){
    this.put(this.url("/models/" + modelId), JSON.stringify(params), callback);
};

client.prototype.getModelFile = function(modelId, fileVersion, includeFile, callback){
    if(typeof(includeFile) == "function"){
        callback = includeFile;
        includeFile = 0;
    }
    var params = {
        file: +includeFile,
    };
    this.get(this.url("/models/" + modelId + "/files/" + fileVersion, params), callback);
};

client.prototype.addModelPhoto = function(modelId, params, callback){
    if(!("file" in params)){
        return callback("error, params missing required property: file");
    }
    this.post(this.url("/models/" + modelId + "/photos/"), JSON.stringify(params), callback);
};

client.prototype.addModelFile = function(modelId, params, callback){
    var required = ["file", "fileName", "hasRightsToModel", "acceptTermsAndConditions"];
    var missing = [];
    required.forEach(function(property){
        if(!(property in params)){
            missing.push(property);
        }
    });
    if(missing.length){
        return callback("error, params missing required parameters: " + missing);
    }

    this.post(this.url("/models/" + modelId + "/files/"), JSON.stringify(params), callback);
};

client.prototype.getPrinters = function(callback){
    this.get(this.url("/printers/"), callback);
};

client.prototype.getPrinter = function(printerId, callback){
    this.get(this.url("/printers/" + printerId), callback);
};

client.prototype.getCategories = function(callback){
    this.get(this.url("/categories/"), callback);
};

client.prototype.getCategory = function(catId, callback){
    this.get(this.url("/categories/" + catId), callback);
};

client.prototype.getPrice = function(params, callback){
    var required = ["volume", "area", "xBoundMin", "xBoundMax", "yBoundMin", "yBoundMax", "zBoundMin", "zBoundMax"];
    var missing = [];
    required.forEach(function(property){
        if(!(property in params)){
            missing.push(property);
        }
    });
    if(missing.length){
        return callback("error, params missing required properties: " + missing);
    }

    this.post(this.url("/price/"), JSON.stringify(params), callback);
};

module.exports = client;
