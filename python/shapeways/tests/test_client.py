from requests_oauthlib import OAuth1
import mock
import requests
import unittest2

from shapeways.client import Client

class MockResponse(object):
    text = None

class TestClient(unittest2.TestCase):
    def test_url_adds_slashes(self):
        client = Client("key", "secret")

        # trailing
        url = client.url("/models")
        self.assertEqual("https://api.shapeways.com/models/v1", url)

        # leading
        url = client.url("models/")
        self.assertEqual("https://api.shapeways.com/models/v1", url)

        # bounding
        url = client.url("models")
        self.assertEqual("https://api.shapeways.com/models/v1", url)

        # multi-part paths
        url = client.url("models/86")
        self.assertEqual("https://api.shapeways.com/models/86/v1", url)

    def test_connect(self):
        return_value = MockResponse()
        return_value.text = "authentication_url=http%3A%2F%2Fapi.shapeways.com%2Flogin%3Foauth_token=052f70be42a6fe0971d4056eb4492c31115353f3&oauth_token_secret=7e412bef15092d4ed06a529b60d3a8c6925cbcf3&oauth_callback_confirmed=true"
        with mock.patch.object(requests, "post", return_value=return_value):
            client = Client(
                "key", "secret", callback_url="http://localhost:3000/callback"
            )
            url = client.connect()
            requests.post.assert_called()
            self.assertEqual(
                url, "http://api.shapeways.com/login?oauth_token=052f70be42a6fe0971d4056eb4492c31115353f3"
            )
            self.assertEqual(
                client.oauth_secret, "7e412bef15092d4ed06a529b60d3a8c6925cbcf3"
            )
            args = requests.post.call_args[1]
            self.assertEqual(
                args["url"], "https://api.shapeways.com/oauth1/request_token/v1"
            )
            self.assertIsInstance(args["auth"], OAuth1)

    def test_verify_url(self):
        # full url
        with mock.patch.object(Client, "verify"):
            client = Client("key", "secret")

            # full url
            client.verify_url(
                "http://example.org?oauth_token=TOKEN&oauth_verifier=VERIFIER"
            )
            client.verify.assert_called()
            args = client.verify.call_args[0]
            self.assertEqual(args[0], "TOKEN")
            self.assertEqual(args[1], "VERIFIER")

            client.verify.reset_mock()

            # query string only
            client.verify_url("oauth_token=TOKEN&oauth_verifier=VERIFIER")
            client.verify.assert_called()
            args = client.verify.call_args[0]
            self.assertEqual(args[0], "TOKEN")
            self.assertEqual(args[1], "VERIFIER")

            client.verify.reset_mock()

            # no query string
            client.verify_url("http://example.org/")
            client.verify.assert_called()
            args = client.verify.call_args[0]
            self.assertEqual(args[0], None)
            self.assertEqual(args[1], None)

            client.verify.reset_mock()

            # missing verifier parameter
            client.verify_url("http://example.org?oauth_token=TOKEN")
            client.verify.assert_called()
            args = client.verify.call_args[0]
            self.assertEqual(args[0], "TOKEN")
            self.assertEqual(args[1], None)

            client.verify.reset_mock()

            # missing token parameter
            client.verify_url("http://example.org?oauth_verifier=VERIFIER")
            client.verify.assert_called()
            args = client.verify.call_args[0]
            self.assertEqual(args[0], None)
            self.assertEqual(args[1], "VERIFIER")

            client.verify.reset_mock()

    def test_verify(self):
        return_value = MockResponse()
        return_value.text = "oauth_token=052f70be42a6fe0971d4056eb4492c31115353f3&oauth_token_secret=7e412bef15092d4ed06a529b60d3a8c6925cbcf3"

        with mock.patch.object(requests, "post", return_value=return_value):
            client = Client("key", "secret")
            client.oauth_secret = None
            client.verify("TOKEN", "VERIFIER")
            requests.post.assert_called()
            self.assertEqual(
                client.oauth_token, "052f70be42a6fe0971d4056eb4492c31115353f3"
            )
            self.assertEqual(
                client.oauth_secret, "7e412bef15092d4ed06a529b60d3a8c6925cbcf3"
            )
            args = requests.post.call_args[1]
            self.assertEqual(
                args["url"], "https://api.shapeways.com/oauth1/access_token/v1"
            )
            self.assertIsInstance(args["auth"], OAuth1)
