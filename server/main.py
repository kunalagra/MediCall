from flask import Flask, request, Response, redirect
from flask_jwt_extended import JWTManager
import secrets
import stripe

secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = "jkajoisjosk"

stripe.api_key = "sk_test_51MxOxySAmG5gMbbMNX2Ma2lglF9BU7oQSVgoe9DdMUMTNo5YNERsuCCkMw286968PwCXCrSCpT3PeOI4MXU5uTgA00M1fUeEjJ"
jwt = JWTManager(app)

YOUR_DOMAIN = 'http://localhost:3000/'


@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return Response()

@app.route('/checkout')
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items = [
                {   
                    "price": "price_1MxPc3SAmG5gMbbMjAeavhpb",
                    "quantity": 1
                }
            ],
            mode="payment",
            success_url=YOUR_DOMAIN + "success",
            cancel_url = YOUR_DOMAIN + "failed"
        )
    except Exception as e:
        return str(e)
 
    return jsonify({'url': checkout_session.url})

from routes.login_signup import *
from routes.profile import *
from routes.doctors import *

if __name__ == "__main__":
    app.run(debug=True)


