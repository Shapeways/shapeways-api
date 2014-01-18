from urllib import urlencode
from urlparse import parse_qs
import json

from requests_oauthlib import OAuth1
import requests

class Client(object):
    """
    """
    __slots__ = [
        "base_url", "api_version", "consumer_key", "consumer_secret",
        "oauth_token", "oauth_secret", "oauth", "callback_url",
    ]
    def __init__(self, consumer_key, consumer_secret, callback_url=None):
        """
        """
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.callback_url = callback_url
        self.base_url = "https://api.shapeways.com"
        self.api_version = "v1"
        self.oauth = OAuth1(
            self.consumer_key,
            client_secret=consumer_secret,
            callback_uri=self.callback_url,
        )

    def url(self, path):
        """
        """
        if not path.startswith("/"):
            path = "/%s" % path
        if not path.endswith("/"):
            path += "/"

        return "%s%s%s" % (self.base_url, path, self.api_version)

    def connect(self):
        """
        """
        response = requests.post(
            url=self.url("/oauth1/request_token/"), auth=self.oauth
        )
        data = parse_qs(response.text)
        self.oauth_secret = data.get("oauth_token_secret", [None])[0]
        return data.get("authentication_url", [None])[0]

    def verify_url(self, url):
        url, _, qs = url.rpartition("?")
        data = parse_qs(qs)
        return self.verify(
            data.get("oauth_token", [None])[0],
            data.get("oauth_verifier", [None])[0]
        )

    def verify(self, oauth_token, oauth_verifier):
        """
        """
        access_oauth = OAuth1(
            self.consumer_key,
            client_secret=self.consumer_secret,
            resource_owner_key=oauth_token,
            resource_owner_secret=self.oauth_secret,
            verifier=oauth_verifier
        )
        response = requests.post(
            url=self.url("/oauth1/access_token/"),
            auth=access_oauth
        )
        data = parse_qs(response.text)
        self.oauth_token = data.get("oauth_token", [None])[0]
        self.oauth_secret = data.get("oauth_token_secret", [None])[0]
        self.oauth = OAuth1(
            self.consumer_key,
            client_secret=self.consumer_secret,
            resource_owner_key=self.oauth_token,
            resource_owner_secret=self.oauth_secret,
        )

    def _get(self, url, params=None):
        """
        response = requests.get(
            url =self.url(path), auth=self.oauth, params=params
        )
        return response.json()

    def _delete(self, url, params=None):
        """
        response = requests.delete(
            url=self.url(url), auth=self.oauth, params=params
        )
        return response.json()

    def _post(self, url, body=None, params=None):
        """
        response = requests.post(
            url=self.url(url), auth=self.oauth, params=params, data=body
        )
        return response.json()

    def _put(self, url, body=None, params=None):
        """
        response = requests.put(
            url=self.url(url), auth=self.oauth, params=params, data=body
        )
        return response.json()

    def get_api_info(self):
        """
        """
        return self._get("/api/")

    def get_cart(self):
        """
        """
        return self._get("/orders/cart/")

    def get_material(self, material_id):
        """
        """
        return self._get("/materials/%s/" % material_id)

    def get_materials(self):
        """
        """
        return self._get("/materials/")

    def get_models(self, page=None):
        params = None
        if page is not None:
            params = {
                "page": int(page)
            }
        return self._get("/models/", params=params)

    def get_model(self, model_id):
        """
        """
        return self._get("/models/%s/" % model_id)

    def get_model_info(self, model_id):
        """
        """
        return self._get("/models/%s/info/" % model_id)

    def delete_model(self, model_id):
        """
        """
        return self._delete("/models/%s/" % model_id)

    def get_printers(self):
        """
        """
        return self._get("/printers/")

    def get_printer(self, printer_id):
        """
        """
        return self._get("/printers/%s/" % printer_id)

    def get_categories(self):
        """
        """
        return self._get("/categories/")

    def get_category(self, category_id):
        """
        """
        return self._get("/categories/%s/" % category_id)

    def get_price(self, params):
        """
        """
        required = [
            "volume", "area", "xBoundMin", "xBoundMax",
            "yBoundMin", "yBoundMax", "zBoundMin", "zBoundMax"
        ]
        missing = []
        for prop in required:
            if prop not in params:
                missing.append(prop)
        if missing:
            raise Exception("get_price missing required parameters: %r" % missing)
        return self._post("/price/", body=json.dumps(params))

    def add_to_cart(self, params):
        """
        """
        if "modelId" not in params:
            raise Exception("add_to_cart missing required parameter ['modelId']")
        return self._post("/orders/cart/", body=json.dumps(params))

    def add_model_file(self, model_id, params):
        """
        """
        required = [
            "file", "fileName", "hasRightsToModel", "acceptTermsAndConditions"
        ]
        missing = []
        for prop in required:
            if prop not in params:
                missing.append(prop)
        if missing:
            raise Exception("add_model_file missing required parameters %r" % missing)
        return self._post(
            "/models/%s/files/" % model_id, body=json.dumps(params)
        )

    def add_model_photo(self, model_id, params):
        """
        """
        if "file" not in params:
            raise Exception("add_model_photo missing required parameter ['file']")
        return self._post(
            "/models/%s/photos/" % model_id, body=json.dumps(params)
        )

    def get_model_file(self, model_id, file_version, include_file=False):
        """
        """
        params = {
            "file": int(include_file),
        }
        return self._get(
            "/models/%s/files/%s/" % (model_id, file_version),
            params=params
        )


    def update_model_info(self, model_id, params):
        """
        """
        return self._put(
            "/models/%s/info/" % model_id, body=json.dumps(params)
        )

    def add_model(self, params):
        """
        """
        required = ["file", "fileName", "hasRightsToModel", "acceptTermsAndConditions"]
        missing = []
        for prop in required:
            if prop not in params:
                missing.append(prop)
        if missing:
            raise Exception("add_model missing required parameters: %r" % missing)
        return self._post("/models/", body=json.dumps(params))
