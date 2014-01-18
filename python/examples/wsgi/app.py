import json

from shapeways.client import Client

client = Client(
    # consumer_key="1c76f37a9a1d8b5b6b33f5af74ecf323d8e14c2c",
    # consumer_secret="059dcb7cb2df148c2ea1edb21f833a38116e76f6",
    consumer_key="<YOUR KEY HERE>",
    consumer_secret="<YOUR SECRET HERE>",
    callback_url="http://localhost:3000/callback"
)

def application(environ, start_response):
    url = environ["PATH_INFO"]
    if url.startswith("/favicon.ico"):
        start_response("204 No Content", [])
        return [""]
    elif url.startswith("/login"):
        url = client.connect()
        start_response("302 Found", [
            ("Location", str(url)),
        ])
        return [""]
    elif url.startswith("/callback"):
        client.verify_url(environ["QUERY_STRING"])
        start_response("302 Found", [
            ("Location", "http://localhost:3000/"),
        ])
        return [""]
    else:
        response = client.get_api_nfo()
        start_response("200 Ok", [
            ("Content-Type", "application/json"),
        ])
        return [str(response.text)]


if __name__ == "__main__":
    from wsgiref.simple_server import make_server
    try:
        httpd = make_server("", 3000, application)
        print "Tracking Server Listening on Port 3000..."
        httpd.serve_forever()
    except KeyboardInterrupt:
        print "Exiting..."
