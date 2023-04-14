from flask import Flask, request, Response
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import secrets

secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key

SECRET_KEY = "jkajoisjosk"

jwt = JWTManager(app)

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return Response()

from routes.login_signup import *
from routes.profile import *

if __name__ == "__main__":
    app.run(debug=True)


