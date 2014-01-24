from urllib import urlencode
from urlparse import parse_qs
import json

from requests_oauthlib import OAuth1
import requests

class Client(object):
    """Api client for the Shapeways API http://developers.shapeways.com

    The API uses OAuth v1 to authenticate clients, so the following steps
    must be used.

    1. Create a client
    2. Connect to API and get request token and authentication url
    3. Send user to authentication url
    4. Verify callback from authentication url

    Example:

    .. code:: python

        client = Client("key", "secret")
        url = client.connect()
        # redirect user to `url`
        # capture response url from authentication callback
        client.verify_url(response_url)
        # make api requests
        info = client.get_api_info()
    """
    __slots__ = [
        "base_url", "api_version", "consumer_key", "consumer_secret",
        "oauth_token", "oauth_secret", "oauth", "callback_url",
    ]
    def __init__(self, consumer_key, consumer_secret, callback_url=None):
        """Constructor for a new :class:`shapeways.client.Client`

        :param consumer_key: The API key for your app
        :type consumer_key: str
        :param consumer_secret: The API secret key for your app
        :type consumer_secret: str
        :param callback_url: The url that should be redirected to after
            successful authentication with Shapeways OAuth
        :type callback_url: str
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
        """Generate the full url for an API path

        .. code:: python

            client = Client("key", "secret")
            url = client.url("/api/")
            # "https://api.shapeways.com/api/v1"

        :param path: The API path to get the url for
        :type path: str
        :returns: the full url to ``path``
        :rtype: str
        """
        if not path.startswith("/"):
            path = "/%s" % path
        if not path.endswith("/"):
            path += "/"

        return "%s%s%s" % (self.base_url, path, self.api_version)

    def connect(self):
        """Get an OAuth request token and authentication url

        :returns: the authentication url that the user must visit or None
            on error
        :rtype: str or None
        """
        response = requests.post(
            url=self.url("/oauth1/request_token/"), auth=self.oauth
        )
        data = parse_qs(response.text)
        self.oauth_secret = data.get("oauth_token_secret", [None])[0]
        return data.get("authentication_url", [None])[0]

    def verify_url(self, url):
        """Parse parameters and properly call :meth:`shapeways.client.Client.verify`

        If you already have the ``oauth_token`` and ``oauth_verifier`` parameters
        parsed, use :meth:`shapeways.client.Client.verify` directly instead.

        :param url: The response url or query string from the
            authentication callback
        :type url: str
        """
        url, _, qs = url.rpartition("?")
        data = parse_qs(qs)
        self.verify(
            data.get("oauth_token", [None])[0],
            data.get("oauth_verifier", [None])[0]
        )

    def verify(self, oauth_token, oauth_verifier):
        """Get an access token and setup OAuth credentials for further use

        If you have the full url or query string from the authentication
        callback then you can use :meth:`shapeways.client.Client.verify_url`
        which will parse the correct parameters from the query string and
        call :meth:`shapeways.client.Client.verify`

        :param oauth_token: the ``oauth_token`` parameter from the
            authentication callback
        :type oauth_token: str
        :param oauth_verifier: the ``oauth_verifier`` parameter from the
            authentication callback
        :type oauth_verifier: str
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

    def _get(self, path, params=None):
        """Fetch the results from an API GET call to ``path``

        :param path: the api path to fetch e.g. ``/api/``
        :type path: str
        :param params: dict of query string parameters to use
        :type params: dict or None
        :returns: the results from the api call
        :rtype: dict
        """
        response = requests.get(
            url =self.url(path), auth=self.oauth, params=params
        )
        return response.json()

    def _delete(self, url, params=None):
        """Fetch the results from an API DELETE call to ``path``

        :param path: the api path to fetch e.g. ``/api/``
        :type path: str
        :param params: dict of query string parameters to use
        :type params: dict or None
        :returns: the results from the api call
        :rtype: dict
        """
        response = requests.delete(
            url=self.url(url), auth=self.oauth, params=params
        )
        return response.json()

    def _post(self, url, body=None, params=None):
        """Fetch the results from an API POST call to ``path``

        :param path: the api path to fetch e.g. ``/api/``
        :type path: str
        :param body: the POST body to use
        :type body: str or None
        :param params: dict of query string parameters to use
        :type params: dict or None
        :returns: the results from the api call
        :rtype: dict
        """
        response = requests.post(
            url=self.url(url), auth=self.oauth, params=params, data=body
        )
        return response.json()

    def _put(self, url, body=None, params=None):
        """Fetch the results from an API PUT call to ``path``

        :param path: the api path to fetch e.g. ``/api/``
        :type path: str
        :param body: the PUT body to use
        :type body: str or None
        :param params: dict of query string parameters to use
        :type params: dict or None
        :returns: the results from the api call
        :rtype: dict
        """
        response = requests.put(
            url=self.url(url), auth=self.oauth, params=params, data=body
        )
        return response.json()

    def get_api_info(self):
        """Make an API call `GET /api/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-api-v1-1>`_

        :returns: api info
        :rtype: dict
        """
        return self._get("/api/")

    def get_cart(self):
        """Make an API call `GET /orders/cart/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-orders-cart-v1>`_

        :returns: items currently in the cart
        :rtype: dict
        """
        return self._get("/orders/cart/")

    def get_material(self, material_id):
        """Make an API call `GET /materials/{material_id}/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-materials-materialId-v1>`_

        :param material_id: the id of the material to fetch
        :type material_id: int
        :returns: specific materials info
        :rtype: dict
        """
        return self._get("/materials/%s/" % material_id)

    def get_materials(self):
        """Make an API call `GET /materials/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-materials-v1>`_

        :returns: information about all materials
        :rtype: dict
        """
        return self._get("/materials/")

    def get_models(self, page=None):
        """Make an API call `GET /models/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-models-v1>`_

        :returns: information about all user's models
        :rtype: dict
        """
        params = None
        if page is not None:
            params = {
                "page": int(page)
            }
        return self._get("/models/", params=params)

    def get_model(self, model_id):
        """Make an API call `GET /models/{model_id}/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-models-modelId-v1>`_

        :param model_id: the id of the model to fetch
        :type mode_id: int
        :returns: data for a specific model
        :rtype: dict
        """
        return self._get("/models/%s/" % model_id)

    def get_model_info(self, model_id):
        """Make an API call `GET /models/{model_id}/info/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-models-modelId-info-v1>`_

        :param model_id: the id of the model to fetch
        :type mode_id: int
        :returns: information for a specific model
        :rtype: dict
        """
        return self._get("/models/%s/info/" % model_id)

    def delete_model(self, model_id):
        """Make an API call `DELETE /models/{model_id}/v1
        <https://developers.shapeways.com/docs?li=dh_docs#DELETE_-models-modelId-v1>`_

        :param model_id: the id of the model to delete
        :type mode_id: int
        :returns: information whether or not it was successful
        :rtype: dict
        """
        return self._delete("/models/%s/" % model_id)

    def get_printers(self):
        """Make an API call `GET /printers/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-printers-v1>`_

        :returns: information about all printers
        :rtype: dict
        """
        return self._get("/printers/")

    def get_printer(self, printer_id):
        """Make an API call `GET /printers/{printer_id}/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-printers-printerId-v1>`_

        :param printer_id: the printer to fetch information for
        :type printer_id: int
        :returns: information about a specific printer
        :rtype: dict
        """
        return self._get("/printers/%s/" % printer_id)

    def get_categories(self):
        """Make an API call `GET /categories/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-categories-v1>`_

        :returns: information about all categories
        :rtype: dict
        """
        return self._get("/categories/")

    def get_category(self, category_id):
        """Make an API call `GET /categories/{category_id}/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-categories-categoryId-v1>`_

        :param category_id: the category to fetch information for
        :type category_id: int
        :returns: information about a specific category
        :rtype: dict
        """
        return self._get("/categories/%s/" % category_id)

    def get_price(self, params):
        """Make an API call `POST /price/v1
        <https://developers.shapeways.com/docs?li=dh_docs#POST_-price-v1>`_

        Required Parameters:

        1. ``volume`` - float
        2. ``area`` - float
        3. ``xBoundMin`` - float
        4. ``xBoundMax`` - float
        5. ``yBoundMin`` - float
        6. ``yBoundMax`` - float
        7. ``zBoundMin`` - float
        8. ``zBoundMax`` - float

        Optional Parameters:

        1. ``materials`` - list

        :param params: dict of necessary parameters to make the api call
        :type params: dict
        :returns: pricing information for the ``params`` given
        :rtype: dict
        :raises: :class:`Exception` when any of the required parameters
            are missing
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
        """Make an API call `POST /orders/cart/v1
        <https://developers.shapeways.com/docs?li=dh_docs#POST_-orders-cart-v1>`_

        Required Parameters:

        1. ``modelId`` - int

        Optional Parameters:

        1. ``materialId`` - int
        2. ``quantity`` - int

        :param params: dict of necessary parameters to make the api call
        :type params: dict
        :returns: whether or not the call was successful
        :rtype: dict
        :raises: :class:`Exception` when the required parameter is missing
        """
        if "modelId" not in params:
            raise Exception("add_to_cart missing required parameter ['modelId']")
        return self._post("/orders/cart/", body=json.dumps(params))

    def add_model_file(self, model_id, params):
        """Make an API call `POST /models/{model_id}/files/v1
        <https://developers.shapeways.com/docs?li=dh_docs#POST_-models-modelId-files-v1>`_

        Required Parameters:

        1. ``file`` - str (the file data)
        2. ``fileName`` - str
        3. ``hasRightsToModel`` - bool
        4. ``acceptTermsAndConditions`` - bool

        Optional Parameters:

        1. ``uploadScale`` - float

        :param model_id: the id of the model to upload the file for
        :type model_id: int
        :param params: dict of necessary parameters to make the api call
        :type params: dict
        :returns: file upload information
        :rtype: dict
        :raises: :class:`Exception` when any of the required parameters
            are missing
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
        """Make an API call `POST /models/{model_id}/photos/v1
        <https://developers.shapeways.com/docs?li=dh_docs#POST_-models-modelId-photos-v1>`_

        Required Parameters:

        1. ``file`` - str (the file data)

        Optional Parameters:

        1. ``title`` - str
        2. ``description`` - str
        3. ``materialId`` - int
        4. ``isDefault`` - bool

        :param model_id: the id of the model to upload the photo for
        :type model_id: int
        :param params: dict of necessary parameters to make the api call
        :type params: dict
        :returns: photo upload information
        :rtype: dict
        :raises: :class:`Exception` when the required parameter is missing
        """
        if "file" not in params:
            raise Exception("add_model_photo missing required parameter ['file']")
        return self._post(
            "/models/%s/photos/" % model_id, body=json.dumps(params)
        )

    def get_model_file(self, model_id, file_version, include_file=False):
        """Make an API call `GET /models/{model_id}/files/{file_version}/v1
        <https://developers.shapeways.com/docs?li=dh_docs#GET_-models-modelId-files-fileVersion-v1>`_

        :param model_id: the id of the model to get the file from
        :type model_id: int
        :param file_version: the file version of the file to fetch
        :type file_version: int
        :param include_file: whether or not to include the raw file data
            in the response
        :type include_file: bool
        :returns: the file information
        :rtype: dict
        """
        params = {
            "file": int(include_file),
        }
        return self._get(
            "/models/%s/files/%s/" % (model_id, file_version),
            params=params
        )


    def update_model_info(self, model_id, params):
        """Make an API call `PUT /models/{model_id}/info/v1
        <https://developers.shapeways.com/docs?li=dh_docs#PUT_-models-modelId-info-v1>`_

        Optional Parameters:

        1. ``uploadScale`` - float
        2. ``title`` - str
        3. ``description`` - str
        4. ``isPublic`` - bool
        5. ``isForSale`` - bool
        6. ``isDownloadable`` - bool
        7. ``tags`` - list
        8. ``materials`` - dict
        9. ``defaultMaterialId`` - int
        10. ``categories`` - list

        :param model_id: the id of the model to get the file from
        :type model_id: int
        :param params: dict of necessary parameters to make the api call
        :type params: dict
        :returns: the model information
        :rtype: dict
        """
        return self._put(
            "/models/%s/info/" % model_id, body=json.dumps(params)
        )

    def add_model(self, params):
        """Make an API call `POST /models/v1
        <https://developers.shapeways.com/docs?li=dh_docs#POST_-models-v1>`_

        Required Parameters:

        1. ``file`` - str (the file data)
        2. ``fileName`` - str
        3. ``hasRightsToModel`` - bool
        4. ``acceptTermsAndConditions`` - bool

        Optional Parameters:

        1. ``uploadScale`` - float
        2. ``title`` - str
        3. ``description`` - str
        4. ``isPublic`` - bool
        5. ``isForSale`` - bool
        6. ``isDownloadable`` - bool
        7. ``tags`` - list
        8. ``materials`` - dict
        9. ``defaultMaterialId`` - int
        10. ``categories`` - list

        :param params: dict of necessary parameters to make the api call
        :type params: dict
        :returns: model upload information
        :rtype: dict
        :raises: :class:`Exception` when any of the required parameters
            are missing
        """
        required = ["file", "fileName", "hasRightsToModel", "acceptTermsAndConditions"]
        missing = []
        for prop in required:
            if prop not in params:
                missing.append(prop)
        if missing:
            raise Exception("add_model missing required parameters: %r" % missing)
        return self._post("/models/", body=json.dumps(params))
