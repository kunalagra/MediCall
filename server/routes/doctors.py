from flask import request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from __main__ import app
from db import DB

CORS(app, supports_credentials=True)
doctor, patients = DB()

@app.route('/doc_status', methods=['GET'])
def doc_status():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'Offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200

@app.route('/get_status', methods=['GET'])
def get_status():
    details = []
    for i in doctor.find():
        details.append({"email": i["email"], "status": i["status"], "username": i["username"], "specialization": i["specialization"], "gender": i["gender"], "phone": i["phone"], "meet": i["meet"], "appointments": i["appointments"], "stars": i["stars"]})
    # print(details)
    return jsonify({"details": details}), 200