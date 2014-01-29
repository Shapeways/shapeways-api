var http = require("http");

var shapeways = require("../../");

var options = {
    consumerKey: "<YOUR KEY HERE>",
    consumerSecret: "<YOUR SECRET HERE>",
    authorizationCallback: "http://localhost:8000/callback",
};

var client = new shapeways.client(options);

var server = http.createServer(function(req, res){
    if(req.url == "/favicon.ico"){
        res.writeHead(204);
        res.end();
    } else if(~req.url.indexOf("/callback")){
        client.verifyUrl(req.url, function(error){
            res.writeHead(302, {Location: "http://localhost:8000/"});
            res.end();
        });
    } else if(req.url == "/login"){
        client.connect(function(error, auth_url){
            res.writeHead(302, {Location: auth_url + "&oauth_callback=" + options.authorizationCallback});
            res.end();
        });
    } else{
        client.getApiInfo(function(error, result){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        });
    }
});
server.listen(8000);
