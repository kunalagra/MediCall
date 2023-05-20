import datetime
import uuid
from flask import Flask, request, Response, redirect, render_template
from flask_jwt_extended import JWTManager
import secrets
import stripe
from flask_mail import Mail
from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_cors import CORS
from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_cors import CORS
import pymongo
from pymongo.server_api import ServerApi
from flask_mail import Message
from dotenv import load_dotenv
import os
import json
import stripe
from threading import Thread

load_dotenv()
secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = secret_key
SECRET_KEY = "jkajoisjosk"

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'deexithmadas277'
app.config['MAIL_PASSWORD'] = os.getenv('PASSWORD')
app.config['MAIL_USE_TLS'] = True
mail = Mail(app)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
jwt = JWTManager(app)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

URI = "mongodb+srv://Deexith06:Deexith06@cluster0gc.0bncw3x.mongodb.net/?retryWrites=true&w=majority"
    

client = pymongo.MongoClient(URI, server_api=ServerApi('1'))

doctor = client.get_database("MediCall").doctors
patients = client.get_database("MediCall").patients

YOUR_DOMAIN = 'https://gfg-sfi.onrender.com/'


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

@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=data['amount'],
            currency='inr',
            payment_method_types=['card'],
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json()
        if data['registerer'] == 'patient':
            if doctor.find_one({'email': data['email']}):
                return jsonify({'message': 'User already exists'}), 400
            user = patients.find_one({'email': data['email']})
            if user:
                return jsonify({'message': 'User already exists'}), 400
            else:
                hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
                data['passwd'] = hashed_password
                data['upcomingAppointments'] = []
                del data['specialization']
                patients.insert_one(data)
                return jsonify({'message': 'User created successfully'}), 200
        elif data['registerer'] == 'doctor':
            if patients.find_one({'email': data['email']}):
                return jsonify({'message': 'User already exists'}), 400
            user = doctor.find_one({'email': data['email']})
            if user:
                return jsonify({'message': 'User already exists'}), 400
            else:
                hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
                data['passwd'] = hashed_password
                data['meet'] = False
                data['appointments'] = 0
                data['stars'] = 0
                data['upcomingAppointments'] = []
                del data["age"]
                doctor.insert_one(data)
                return jsonify({'message': 'User created successfully'}), 200
        else:
            return jsonify({'message': 'Invalid registerAs'}), 400
    else:
        return jsonify({'message': 'Invalid request'}), 400

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    data = request.get_json()
    var = patients.find_one({'email': data['email']})
    if var:
        if bcrypt.check_password_hash(var['passwd'], data['passwd']):
            access_token = create_access_token(identity=data['email'])
            # token = access_token.decode('utf-8')
            return jsonify({'message': 'User logged in successfully', 'access_token': access_token, "username": var["username"], "usertype": "patient", "gender": var["gender"], "phone": var["phone"], "age": var["age"]}), 200
        else:
            return jsonify({'message': 'Invalid password'}), 400
    else:
        doctor.update_one({'email': data['email']}, {'$set': {'status': 'online'}})
        var = doctor.find_one({'email': data['email']})
        if var:
            if bcrypt.check_password_hash(var['passwd'], data['passwd']):
                access_token = create_access_token(identity=data['email'])
                # token = access_token.decode('utf-8')
                return jsonify({'message': 'User logged in successfully', 'access_token': access_token, "username": var["username"], "usertype": "doctor", "gender": var["gender"], "phone": var["phone"], "specialization": var["specialization"], "meet": var["meet"], "verified": var.get("verified", False)}), 200
            else:
                return jsonify({'message': 'Invalid password'}), 400
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
        
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data['email']
    var = doctor.find_one({'email': email})
    print(var.get("verified", False))
    return jsonify({'message': 'verification details', "verified": var.get("verified", False)}), 200

        
@app.route('/doc_status', methods=['PUT'])
def doc_status():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/meet_status', methods=['POST'])
def meet_status():
    data = request.get_json()
    user = data['email']
    details = doctor.find_one({'email': user})
    if details['meet'] == True:
        return jsonify({'message': 'Doctor is already in a meet'}), 208
    else:
        doctor.update_one({'email': user}, {'$set': {'meet': True}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200

# @app.route('/meet_end', methods=['PUT'])
# def meet_end():
#     data = request.get_json()
#     user = data['email']
#     doctor.update_one({'email': user}, {'$set': {'meet': False}})
#     return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    count = 0
    for i in doctor.find():
        if i.get('verified', False):
            count += 1
            details.append({"email": i["email"], "status": i["status"], "username": i["username"], "specialization": i["specialization"], "gender": i["gender"], "phone": i["phone"], "isInMeet": i["meet"], "noOfAppointments": i["appointments"], "noOfStars": i["stars"], "id": count, 'fee': i.get('fee', 199)})
    # print(details)
    return jsonify({"details": details}), 200

def send_email_async(msg):
    with app.app_context():
        mail.send(msg)


@app.route('/mail_file', methods=['POST'])
def mail_file():
    # get form data
    user = request.form.get("email")
    f = request.files['file']
    file_name = "Receipt.pdf"
    file_content = f.read()
    
    msg = Message("Receipt cum Prescription for your Consultancy",
                  sender="deexithmadas277@gmail.com",
                  recipients=[user])
    pat = patients.find_one({'email': user})
    msg.html = render_template('email.html', Name=pat['username'])
    msg.attach(file_name, "application/pdf", file_content)
    thread = Thread(target=send_email_async, args=(msg,))
    thread.start()

    return jsonify({"message": "successfully sent"}), 200

@app.route('/doctor_app', methods=['POST'])
def doctor_app():
    data = request.get_json()
    email = data['email']
    doctor.update_one({'email': email}, {'$inc': {'appointments': 1, 'stars': data['stars']}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/set_appointment', methods=['POST', 'PUT'])
def set_appointment():
    data = request.get_json()
    email = data['email']
    doc = doctor.find_one({'email': email})
    if request.method == 'POST':
        return jsonify({'message': 'Doctor Appointments', 'appointments': doc['upcomingAppointments']}), 200
    else:
        doc['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "patient": data['patient'],
            "pemail": data['pemail'],
            "link": data['link'],
        })
        doctor.update_one({'email': email}, {'$set': {'upcomingAppointments': doc['upcomingAppointments']}})
        return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/patient_apo', methods=['POST', 'PUT'])
def patient_apo():
    data = request.get_json()
    email = data['email']
    pat = patients.find_one({'email': email})

    if request.method == 'POST':
        return jsonify({'message': 'Patient Appointments', 'appointments': pat['upcomingAppointments']}), 200
    else:
        pat['upcomingAppointments'].append({
            "date": data['date'],
            "time": data['time'],
            "doctor": data['doctor'],
            "demail": data['demail'],
            "link": data['link'],
        })
        patients.update_one({'email': email}, {'$set': {'upcomingAppointments': pat['upcomingAppointments']}})
        return jsonify({'message': 'Patient status updated successfully'}), 200
    
@app.route('/make_meet', methods=['POST', 'PUT'])
def make_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        print(data['link'])
        doctor.update_one({'email': email}, {'$set': {'link': {'link': data['link'], "name": data['patient']}}})
        return jsonify({'message': 'Meet link created successfully'}), 200
    else:
        doc = doctor.find_one({'email': email})
        return jsonify({'message': 'Meet link', 'link': doc.get('link', None)}), 200
    
@app.route('/delete_meet', methods=['PUT'])
def delete_meet():
    data = request.get_json()
    email = data['email']
    doctor.update_one({'email': email}, {'$unset': {'link': None, 'currentlyInMeet': None}})
    doctor.update_one({'email': email}, {'$set': {'meet': False}})

    return jsonify({'message': 'Meet link deleted successfully'}), 200

@app.route('/currently_in_meet', methods=['POST', 'PUT'])
def currently_in_meet():
    data = request.get_json()
    email = data['email']
    if request.method == 'PUT':
        doctor.update_one({'email': email}, {'$set': {'currentlyInMeet': True}})
        return jsonify({'message': 'Currently in meet'}), 200
    else:
        doc = doctor.find_one({'email': email})
        return jsonify({'message': 'Currently in meet', 'curmeet': doc.get('currentlyInMeet', False)}), 200
    
# @app.route('/delete_currently_in_meet', methods=['PUT'])
# def delete_currently_in_meet():
#     data = request.get_json()
#     email = data['email']
#     return jsonify({'message': 'Not Currently in meet'}), 200
    
@app.route("/doctor_avilability", methods=['PUT'])
def doctor_avilability():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'online'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route("/add_order", methods=['POST'])
def add_order():
    data = request.get_json()
    email = data['email']
    print(data)
    var = patients.find_one({'email': email})
    if var:
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        patients.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    else:
        var = doctor.find_one({"email":email})
        orders = var.get('orders', [])
        for i in data["orders"]:
            i['key'] = str(uuid.uuid4())
            i['Ordered_on'] = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            orders.append(i)
        doctor.update_one({'email': email}, {'$set': {'orders': orders}})
        return jsonify({'message': 'Order added successfully'}), 200
    
@app.route("/get_orders", methods=['POST'])
def get_orders():
    data = request.get_json()
    email = data['email']
    var = patients.find_one({'email':email})
    if var:
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200
    else:
        var = doctor.find_one({'email': email})
        return jsonify({'message': 'Orders', 'orders': var['orders']}), 200

@app.route('/update_details', methods=['PUT'])
def update_details():
    data = request.get_json()
    usertype = data['usertype']
    email = data['email']
    if usertype == 'doctor':
        if data['passwd'] == '':
            doctor.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'specialization': data['specialization'], 'gender': data['gender'], 'fee': data['fee']}})
        else:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
            doctor.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'specialization': data['specialization'], 'passwd': data['passwd'], 'gender': data['gender'], 'fee': data['fee']}})
        return jsonify({'message': 'Doctor details updated successfully'}), 200
    else:
        if data['passwd'] == '':
            patients.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'], 'age': data['age'], 'gender': data['gender']}})
        else:
            hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
            data['passwd'] = hashed_password
            patients.update_one({'email': email}, {'$set': {'username': data['username'], 'phone': data['phone'],  'passwd': data['passwd'], 'age': data['age'], 'gender': data['gender']}})
        return jsonify({'message': 'Patient details updated successfully'}), 200


if __name__ == "__main__":
    app.run(debug=True)


