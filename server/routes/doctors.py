from flask import request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from __main__ import app
from db import DB

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