from flask import request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from __main__ import app,mail
from db import DB
from flask_mail import Message
import os

CORS(app, supports_credentials=True)
doctor, patients = DB()

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

# @app.route('/meet_status', methods=['PUT'])
# def meet_status():
#     data = request.get_json()
#     user = data['email']
#     doctor.update_one({'email': user}, {'$set': {'meet': False}})
#     return jsonify({'message': 'Doctor status updated successfully'}), 200

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
    data = request.get_json()
    user = data['email']
    details = doctor.find_one({'email': user})
    # customer = details['meet']
    f = request.files['file']
    f.save(f.filename)
    msg = Message("Prescription for your Consultancy",
                  sender="deexithmadas277@gmail.com",
                  recipients=["dgkiskunal.agrawal@gmail.com"])
    msg.body = "PFA Prescription for today's appointment on MediCall"
    with app.open_resource(f.filename) as fp:
        msg.attach(f.filename, 'application/pdf', fp.read())
    mail.send(msg)
    os.remove(f.filename)
    return jsonify({"messgae": "successfully sent"}), 200

