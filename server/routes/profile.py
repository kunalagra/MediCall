from flask import request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from __main__ import app
from db import DB

CORS(app, supports_credentials=True)
doctor, patients = DB()

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user = get_jwt_identity()
    return jsonify({'user': user}), 200

@app.route('/doc_status', methods=['PUT'])
def doc_status():
    data = request.get_json()
    user = data['email']
    doctor.update_one({'email': user}, {'$set': {'status': 'Offline'}})
    return jsonify({'message': 'Doctor status updated successfully'}), 200
