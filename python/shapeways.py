import base64
import json
import requests
from requests_oauthlib import OAuth1
from urlparse import parse_qs

API_VERSION = 'v1'
API_SERVER = 'api.shapeways.com'
REQUEST_TOKEN_URL = "http://{host}/oauth1/request_token/{version}".format(host=API_SERVER, version=API_VERSION)
ACCESS_TOKEN_URL = "http://{host}/oauth1/access_token/{version}".format(host=API_SERVER, version=API_VERSION)

class Shapeways(object):

    def __init__(self, client_key, client_secret, callback_uri):

        self.client_key = client_key
        self.client_secret = client_secret
        self.oauth = OAuth1(client_key=client_key, client_secret=client_secret, callback_uri=callback_uri)

    def get_auth_url(self):
        r = requests.post(url=REQUEST_TOKEN_URL, auth=self.oauth)
        credentials = parse_qs(r.content)
        self.resource_owner_secret = credentials["oauth_token_secret"][0]
        return credentials["authentication_url"][0]

    def get_access_token(self, token, verifier):
        oauth =  OAuth1(
            client_key = self.client_key,
            client_secret = self.client_secret,
            resource_owner_key = token,
            resource_owner_secret = self.resource_owner_secret,
            verifier = verifier
        )
        r = requests.post(url=ACCESS_TOKEN_URL, auth=oauth)
        credentials = parse_qs(r.content)
        self.oauth =  OAuth1(
            client_key = self.client_key,
            client_secret = self.client_secret,
            resource_owner_key = credentials["oauth_token"][0],
            resource_owner_secret = credentials["oauth_token_secret"][0]
        )
        return True

    def get_models(self):
        r = requests.get(url="http://{host}/model/{version}".format(host=API_SERVER, version=API_VERSION), auth=self.oauth)
        return r.json()

    def get_model(self, model_id):
        r = requests.get(url="http://{host}/model/{model_id}/{version}".format(host=API_SERVER, version=API_VERSION, model_id=model_id), auth=self.oauth)
        return r.json()

    def upload_model(self, file):
        payload = {
            "file": base64.b64encode(file.read()),
            "fileName": file.filename,
            "ownOrAuthorizedModel": 1,
            "acceptTermsAndConditions": 1
        }
        r = requests.post(url="http://{host}/model/{version}".format(host=API_SERVER, version=API_VERSION), data=json.dumps(payload), auth=self.oauth)
        return r.json()
