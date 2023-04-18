from flask import Flask, request, Response, redirect
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

stripe.api_key = "sk_test_51MxOxySAmG5gMbbMNX2Ma2lglF9BU7oQSVgoe9DdMUMTNo5YNERsuCCkMw286968PwCXCrSCpT3PeOI4MXU5uTgA00M1fUeEjJ"
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

@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json()
        if data['registerer'] == 'patient':
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
                return jsonify({'message': 'User logged in successfully', 'access_token': access_token, "username": var["username"], "usertype": "doctor", "gender": var["gender"], "phone": var["phone"], "specialization": var["specialization"], "meet": var["meet"]}), 200
            else:
                return jsonify({'message': 'Invalid password'}), 400
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
        
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

@app.route('/meet_end', methods=['PUT'])
def meet_end():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'meet': False}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    count = 0
    for i in doctor.find():
        count += 1
        details.append({"email": i["email"], "status": i["status"], "username": i["username"], "specialization": i["specialization"], "gender": i["gender"], "phone": i["phone"], "isInMeet": i["meet"], "noOfAppointments": i["appointments"], "noOfStars": i["stars"], "id": count})
    # print(details)
    return jsonify({"details": details}), 200

@app.route('/mail_file', methods=['POST'])
def mail_file():
    data = request.form.to_dict()
    user = data['email']
    # customer = details['meet']
    f = request.files['file']
    f.save(f.filename)
    msg = Message("Prescription for your Consultancy",
                  sender="deexithmadas277@gmail.com",
                  recipients=[user])
    msg.body = "PFA Prescription for today's appointment on MediCall"
    with app.open_resource(f.filename) as fp:
        msg.attach(f.filename, 'application/pdf', fp.read())
    mail.send(msg)
    os.remove(f.filename)
    return jsonify({"messgae": "successfully sent"}), 200

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
            "meet": data['meet'],
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
            "meet": data['meet'],
        })
        patients.update_one({'email': email}, {'$set': {'upcomingAppointments': pat['upcomingAppointments']}})
        return jsonify({'message': 'Patient status updated successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True)


