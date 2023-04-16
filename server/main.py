from flask import Flask, request, Response, redirect
from flask_jwt_extended import JWTManager
import secrets
import stripe

secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = "jkajoisjosk"

stripe.api_key = "sk_test_51MwfyaSFznW0D5NLB8qggSTaXWB4Fx10kZ4PFofMIrsoX6YQiUd0iSXv6lhuwQdJKZNQhN3VUgiAfTL7WOPvX2Qa00LIruHAA9"
jwt = JWTManager(app)

YOUR_DOMAIN = 'http://localhost:3000/'

@app.route('/btn checkout_btn',methods=["POST"])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items = [
                {   
                    "price": "cartTotal",
                    "quantity": "item.quantity",
                }
            ],
            mode="payment",
            success_url=YOUR_DOMAIN + "/success.html",
            cancel_url = YOUR_DOMAIN + "/cancel.html"
        )
    except Exception as e:
        return str(e)
 
    return redirect(checkout_session.url,code=303)

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        return Response()

from routes.login_signup import *
from routes.profile import *
from routes.doctors import *

if __name__ == "__main__":
    app.run(debug=True)


