import json

import mock
import unittest2

from shapeways.client import Client


class TestApi(unittest2.TestCase):
    def setUp(self):
        self.get = mock.patch.object(Client, "_get")
        self.get.start()

        self.delete = mock.patch.object(Client, "_delete")
        self.delete.start()

        self.post = mock.patch.object(Client, "_post")
        self.post.start()

        self.put = mock.patch.object(Client, "_put")
        self.put.start()

    def tearDown(self):
        self.get.stop()
        self.delete.stop()
        self.post.stop()
        self.put.stop()

    def test_get_api_info(self):
        client = Client("key", "value")
        client.get_api_info()
        client._get.assert_called()
        client._get.assert_called_with("/api/")

    def test_get_cart(self):
        client = Client("key", "value")
        client.get_cart()
        client._get.assert_called()
        client._get.assert_called_with("/orders/cart/")

    def test_get_material(self):
        client = Client("key", "value")
        client.get_material(86)
        client._get.assert_called()
        client._get.assert_called_with("/materials/86/")

    def test_get_materials(self):
        client = Client("key", "value")
        client.get_materials()
        client._get.assert_called()
        client._get.assert_called_with("/materials/")

    def test_get_models(self):
        client = Client("key", "value")

        client.get_models()
        client._get.assert_called()
        client._get.assert_called_with("/models/", params=None)

        client._get.reset_mock()

        client.get_models(page=5)
        client._get.assert_called()
        client._get.assert_called_with("/models/", params={"page": 5})


    def test_get_model(self):
        client = Client("key", "value")
        client.get_model(86)
        client._get.assert_called()
        client._get.assert_called_with("/models/86/")

    def test_get_model_info(self):
        client = Client("key", "value")
        client.get_model_info(86)
        client._get.assert_called()
        client._get.assert_called_with("/models/86/info/")

    def test_delete_model(self):
        client = Client("key", "value")
        client.delete_model(86)
        client._delete.assert_called()
        client._delete.assert_called_with("/models/86/")

    def test_get_printers(self):
        client = Client("key", "value")
        client.get_printers()
        client._get.assert_called()
        client._get.assert_called_with("/printers/")

    def test_get_printer(self):
        client = Client("key", "value")
        client.get_printer(86)
        client._get.assert_called()
        client._get.assert_called_with("/printers/86/")

    def test_get_categories(self):
        client = Client("key", "value")
        client.get_categories()
        client._get.assert_called()
        client._get.assert_called_with("/categories/")

    def test_get_category(self):
        client = Client("key", "value")
        client.get_category(86)
        client._get.assert_called()
        client._get.assert_called_with("/categories/86/")

    def test_get_price(self):
        client = Client("key", "value")
        params = {
            "volume": 2,
            "area": 2,
            "xBoundMin": 2,
            "xBoundMax": 3,
            "yBoundMin": 2,
            "yBoundMax": 3,
            "zBoundMin": 2,
            "zBoundMax": 3,
        }
        client.get_price(params)
        client._post.assert_called()
        client._post.assert_called_with("/price/", body=json.dumps(params))

        params = {
            "volume": 2,
            "area": 2,
            "xBoundMax": 3,
            "yBoundMax": 3,
            "zBoundMax": 3,
        }
        with self.assertRaises(Exception):
            client.get_price(params)

    def test_add_to_cart(self):
        client = Client("key", "value")
        params = {
            "modelId": 86,
        }
        client.add_to_cart(params)
        client._post.assert_called()
        client._post.assert_called_with("/orders/cart/", body=json.dumps(params))

        with self.assertRaises(Exception):
            client.add_to_cart({})

    def test_add_model_file(self):
        client = Client("key", "value")
        params = {
            "file": "<FILE DATA>",
            "fileName": "file.ext",
            "hasRightsToModel": True,
            "acceptTermsAndConditions": True,
        }
        client.add_model_file(86, params)
        client._post.assert_called()
        client._post.assert_called_with("/models/86/files/", body=json.dumps(params))

        params = {
            "file": "<FILE DATA>",
            "hasRightsToModel": True,
        }
        with self.assertRaises(Exception):
            client.add_model_file(86, params)

    def test_add_model_photo(self):
        client = Client("key", "value")
        params = {
            "file": "<FILE DATA>",
        }
        client.add_model_photo(86, params)
        client._post.assert_called()
        client._post.assert_called_with("/models/86/photos/", body=json.dumps(params))

        with self.assertRaises(Exception):
            client.add_model_photo(86, {})

    def test_get_model_file(self):
        client = Client("key", "value")
        client.get_model_file(86, 24, include_file=False)
        client._get.assert_called()
        client._get.assert_called_with("/models/86/files/24/", params={"file": 0})

        client._get.reset_mock()

        client.get_model_file(86, 24, include_file=True)
        client._get.assert_called()
        client._get.assert_called_with("/models/86/files/24/", params={"file": 1})

        client._get.reset_mock()

        client.get_model_file(86, 24)
        client._get.assert_called()
        client._get.assert_called_with("/models/86/files/24/", params={"file": 0})

    def test_update_model_info(self):
        client = Client("key", "value")
        params = {
            "filkey": "value",
        }
        client.update_model_info(86, params)
        client._put.assert_called()
        client._put.assert_called_with("/models/86/info/", body=json.dumps(params))

    def test_add_model(self):
        client = Client("key", "value")
        params = {
            "file": "<FILE DATA>",
            "fileName": "file.ext",
            "hasRightsToModel": True,
            "acceptTermsAndConditions": True,
        }
        client.add_model(params)
        client._post.assert_called()
        client._post.assert_called_with("/models/", body=json.dumps(params))

        params = {
            "file": "<FILE DATA>",
            "hasRightsToModel": True,
        }
        with self.assertRaises(Exception):
            client.add_model(params)
