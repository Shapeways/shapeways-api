var querystring = require("querystring");

var oauth = require("oauth");

/**
 * @callback client~connectCallback
 * @param {(string|null)} error - error message or null
 * @param {(string|null)} authentication_url - the oauth authentication url or null
 */

/**
 * @callback client~verifyCallback
 * @param {(string|null)} error - error message or null
 */

/**
 * @callback client~resultsCallback
 * @param {(string|null)} error - error message or null
 * @param {(object|null)} results - the results from the api call
 */

/**
 * Represents an API Client
 *
 * @constructor
 * @param {object} [options={}] - setup options
 * @param {client~connectCallback} [callback] - call client.connect immediately after setup, passing it callback
 */
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

/**
 * Build a full API url from the portion that is given
 *
 * @method url
 * @memberof client
 * @instance client
 * @param {string} path - the api path portion to build
 * @param {object} [params] - Object of query string parameters to use
 * @return {string} Returns full API url from path and params
 **/
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

/**
 * Connect to API server and get OAuth request token and authentication url
 *
 * @method connect
 * @memberof client
 * @instance client
 * @param {client~connectCallback} [callback] - function to call when finished
 **/
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

/**
 * Parse the required parameters from OAuth authentication response url and
 * pass to client.verify
 *
 * @method verifyUrl
 * @memberof client
 * @instance client
 * @param {client~verifyCallback} [callback] - function to call when finished
 **/
client.prototype.verifyUrl = function(url, callback){
    var query = querystring.parse(url.split("?", 2)[1]);
    return this.verify(query.oauth_token, query.oauth_verifier, callback);
};

/**
 * Request an OAuth access token with the provided oauth_token and oauth_verifier parameters
 *
 * @method verify
 * @memberof client
 * @instance client
 *
 * @param {string} token - oauth_token from authentication response query string
 * @param {string} verifier - oauth_verifier from authentication response query string
 * @param {client~verifyCallback} [callback] - function to call when finished
 **/
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

/**
 * Make a HTTP GET request to the url using the OAuth credentials
 *
 * @method get
 * @memberof client
 * @instance client
 *
 * @param {string} url - the url to make the request to
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make a HTTP DELETE request to the url using the OAuth credentials
 *
 * @method delete
 * @memberof client
 * @instance client
 *
 * @param {string} url - the url to make the request to
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make a HTTP POST request to the url using the OAuth credentials
 *
 * @method post
 * @memberof client
 * @instance client
 *
 * @param {string} url - the url to make the request to
 * @param {string} [body] - the POST body data to send with the request
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make a HTTP PUT request to the url using the OAuth credentials
 *
 * @method put
 * @memberof client
 * @instance client
 *
 * @param {string} url - the url to make the request to
 * @param {string} [body] - the PUT body data to send with the request
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make an API call [GET /api/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-api-v1-1}
 *
 * @method getApiInfo
 * @memberof client
 * @instance client
 *
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getApiInfo = function(callback){
    this.get(this.url("/api/"), callback);
};

/**
 * Make an API call [GET /orders/cart/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-orders-cart-v1}
 *
 * @method getCart
 * @memberof client
 * @instance client
 *
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getCart = function(callback){
    this.get(this.url("/orders/cart/"), callback);
};

/**
 * Make an API call [POST /orders/cart/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#POST_-orders-cart-v1}
 *
 * @method addToCart
 * @memberof client
 * @instance client
 *
 * @param {object} params - parameters to send with the query
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.addToCart = function(params, callback){
    if(!params.modelId){
        return callback("params is missing required modelId parameter");
    }

    this.post(this.url("/orders/cart/", params), null, callback);
};

/**
 * Make an API call [GET /materials/{materialId}/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-materials-materialId-v1}
 *
 * @method getMaterial
 * @memberof client
 * @instance client
 *
 * @param {number} materialId - material id of the material to get
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getMaterial = function(materialId, callback){
    this.get(this.url("/materials/" + materialId), callback);
};

/**
 * Make an API call [GET /materials/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-materials-v1}
 *
 * @method getMaterials
 * @memberof client
 * @instance client
 *
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getMaterials = function(callback){
    this.get(this.url("/materials/"), callback);
};

/**
 * Make an API call [GET /models/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-models-v1}
 *
 * @method getModels
 * @memberof client
 * @instance client
 *
 * @param {number} [page] - which page to fetch
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make an API call [GET /models/{modelId}/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-models-modelId-v1}
 *
 * @method getModel
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model to fetch
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getModel = function(modelId, callback){
    this.get(this.url("/models/" + modelId), callback);
};

/**
 * Make an API call [POST /models/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#POST_-models-v1}
 *
 * @method addModel
 * @memberof client
 * @instance client
 *
 * @param {object} params - the model data to use
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make an API call [GET /models/{modelId}/info/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-models-modelId-info-v1}
 *
 * @method getModelInfo
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model to fetch information for
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getModelInfo = function(modelId, callback){
    this.get(this.url("/models/" + modelId + "/info/"), callback);
};

/**
 * Make an API call [DELETE /models/{modelId}/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#DELETE_-models-modelId-v1}
 *
 * @method deleteModel
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model to delete
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.deleteModel = function(modelId, callback){
    this.delete(this.url("/models/" + modelId), callback);
};

/**
 * Make an API call [PUT /models/{modelId}/info/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#PUT_-models-modelId-info-v1}
 *
 * @method updateModelInfo
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model to update
 * @param {object} params - model data to update with
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.updateModelInfo = function(modelId, params, callback){
    this.put(this.url("/models/" + modelId), JSON.stringify(params), callback);
};

/**
 * Make an API call [GET /models/{modelId}/files/{fileVersion}/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-models-modelId-files-fileVersion-v1}
 *
 * @method getModelFile
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model the file belongs to
 * @param {int} fileVersion - the version of the file to get
 * @param {boolean} [includeFile=false] - whether or not to include the raw file data with the response
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make an API call [POST /models/{modelId}/photos/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#POST_-models-modelId-photos-v1}
 *
 * @method addModelPhoto
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model the photo belongs to
 * @param {object} params - the photo information
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.addModelPhoto = function(modelId, params, callback){
    if(!("file" in params)){
        return callback("error, params missing required property: file");
    }
    this.post(this.url("/models/" + modelId + "/photos/"), JSON.stringify(params), callback);
};

/**
 * Make an API call [POST /models/{modelId}/files/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#POST_-models-modelId-files-v1}
 *
 * @method addModelFile
 * @memberof client
 * @instance client
 *
 * @param {number} modelId - the model the file belongs to
 * @param {object} params - the file information
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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

/**
 * Make an API call [GET /printers/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-printers-v1}
 *
 * @method getPrinters
 * @memberof client
 * @instance client
 *
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getPrinters = function(callback){
    this.get(this.url("/printers/"), callback);
};

/**
 * Make an API call [GET /printers/{printerId}/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-printers-printerId-v1}
 *
 * @method getPrinters
 * @memberof client
 * @instance client
 *
 * @param {number} printerId - the printer id to get information for
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getPrinter = function(printerId, callback){
    this.get(this.url("/printers/" + printerId), callback);
};

/**
 * Make an API call [GET /categories/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-categories-v1}
 *
 * @method getCategories
 * @memberof client
 * @instance client
 *
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getCategories = function(callback){
    this.get(this.url("/categories/"), callback);
};

/**
 * Make an API call [GET /categories/{categoryId}/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#GET_-categories-categoryId-v1}
 *
 * @method getCategory
 * @memberof client
 * @instance client
 *
 * @param {number} catId - the category id to fetch
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
client.prototype.getCategory = function(catId, callback){
    this.get(this.url("/categories/" + catId), callback);
};

/**
 * Make an API call [POST /price/v1]{@link https://developers.shapeways.com/docs?li=dh_docs#POST_-price-v1}
 *
 * @method gePrice
 * @memberof client
 * @instance client
 *
 * @param {object} params - the pricing information to get pricing for
 * @param {client~resultsCallback} [callback] - function to call when finished
 **/
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
