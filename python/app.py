
from flask import Flask, abort, redirect, url_for, session, request, render_template

import base64
from functools import wraps
import json
import requests
from requests_oauthlib import OAuth1

from urlparse import parse_qs

app = Flask(__name__)
app.secret_key = '\xa0,,I\x96\x91\xd5p0\xdd\x11\xe1ii\xefH\xb2\x195\x10!\x8c\xfc('

client_key = '2c74e97709ac200da02222036df4ec3c5997ba51'
client_secret = 'dc9bce571e5953db857356240b5e9778c641bd3e'

API_VERSION = 'v1'
API_SERVER = 'api.shapeways.com'
REQUEST_TOKEN_URL = "http://{host}/oauth1/request_token/{version}".format(host=API_SERVER, version=API_VERSION)
ACCESS_TOKEN_URL = "http://{host}/oauth1/access_token/{version}".format(host=API_SERVER, version=API_VERSION)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not "oauth_access_token" in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.route("/")
@login_required
def front():
    return redirect(url_for('model_list'))

@app.route("/login")
def login():
    oauth = OAuth1(client_key, client_secret=client_secret, callback_uri="http://localhost:5000/callback")
    r = requests.post(url=REQUEST_TOKEN_URL, auth=oauth)
    credentials = parse_qs(r.content)
    session["oauth_token_secret"] = credentials["oauth_token_secret"][0]
    return redirect(credentials["authentication_url"][0])

@app.route("/callback")
def callback():
    qps = parse_qs(request.url)
    oauth = OAuth1(
        client_key,
        client_secret=client_secret,
        resource_owner_key=qps["oauth_token"][0],
        resource_owner_secret=session["oauth_token_secret"],
        verifier=qps["oauth_verifier"][0]
    )
    r = requests.post(url=ACCESS_TOKEN_URL, auth=oauth)
    credentials = parse_qs(r.content)
    session["oauth_access_token"] = credentials["oauth_token"][0]
    session["oauth_token_secret"] = credentials["oauth_token_secret"][0]
    return redirect(url_for('front'))

@app.route("/upload")
@login_required
def upload():
    return render_template("upload.html")

@app.route("/model/upload", methods=["POST"])
@login_required
def model_upload():

    upload = {
        "file": base64.b64encode(request.files['modelUpload'].read()),
        "fileName": request.files['modelUpload'].filename,
        "ownOrAuthorizedModel": 1,
        "acceptTermsAndConditions": 1
    }

    oauth = OAuth1(
        client_key,
        client_secret=client_secret,
        resource_owner_key=session["oauth_access_token"],
        resource_owner_secret=session["oauth_token_secret"]
    )

    r = requests.post(url="http://{host}/model/{version}".format(host=API_SERVER, version=API_VERSION), data=json.dumps(upload), auth=oauth)

    return render_template("upload_success.html", **r.json())

@app.route("/model/<model_id>")
@login_required
def model(model_id):

    oauth = OAuth1(
        client_key,
        client_secret=client_secret,
        resource_owner_key=session["oauth_access_token"],
        resource_owner_secret=session["oauth_token_secret"]
    )

    r = requests.get(url="http://{host}/model/{model_id}/{version}".format(host=API_SERVER, version=API_VERSION, model_id=model_id), auth=oauth)
    return render_template("model.html", **r.json())

@app.route("/model")
@login_required
def model_list():

    oauth = OAuth1(
        client_key,
        client_secret=client_secret,
        resource_owner_key=session["oauth_access_token"],
        resource_owner_secret=session["oauth_token_secret"]
    )

    r = requests.get(url="http://{host}/model/{version}".format(host=API_SERVER, version=API_VERSION), auth=oauth)
    return render_template("model_index.html", models=r.json()["models"])

@app.route("/logout")
def logout():
    print '--- LOGOUT ---'
    session.pop("oauth_access_token")
    return redirect(url_for('front'))


if __name__ == "__main__":
    app.run(debug=True)