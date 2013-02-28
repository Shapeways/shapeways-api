
from flask import Flask, redirect, url_for, session, request, render_template

from functools import wraps
from urlparse import parse_qs

from shapeways import Shapeways

app = Flask(__name__)
app.secret_key = '\xa0,,I\x96\x91\xd5p0\xdd\x11\xe1ii\xefH\xb2\x195\x10!\x8c\xfc('

client_key = '2c74e97709ac200da02222036df4ec3c5997ba51'
client_secret = 'dc9bce571e5953db857356240b5e9778c641bd3e'

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not "shapeways" in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.route("/")
@login_required
def front():
    return redirect(url_for('model_list'))

@app.route("/login")
def login():
    session["shapeways"] = Shapeways(client_key, client_secret, callback_uri="http://localhost:5000/callback")
    return redirect(session["shapeways"].get_auth_url())

@app.route("/callback")
def callback():
    qps = parse_qs(request.url)
    session["shapeways"].get_access_token(qps["oauth_token"][0], qps["oauth_verifier"][0])
    session.modified = True
    return redirect(url_for('front'))

@app.route("/upload")
@login_required
def upload():
    return render_template("upload.html")

@app.route("/model/upload", methods=["POST"])
@login_required
def model_upload():
    model = session["shapeways"].upload_model(request.files['modelUpload'])
    return render_template("upload_success.html", **model)

@app.route("/model/<model_id>")
@login_required
def model(model_id):
    model = session["shapeways"].get_model(model_id)
    return render_template("model.html", **model)

@app.route("/model")
@login_required
def model_list():
    models = session["shapeways"].get_models()
    return render_template("model_index.html", models=models["models"])

@app.route("/logout")
def logout():
    print '--- LOGOUT ---'
    del session["shapeways"]
    return redirect(url_for('front'))


if __name__ == "__main__":
    app.run(debug=True)