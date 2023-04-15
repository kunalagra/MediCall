import pymongo
from pymongo.server_api import ServerApi

def DB():
    URI = "mongodb+srv://Deexith06:Deexith06@cluster0gc.0bncw3x.mongodb.net/?retryWrites=true&w=majority"
    

    client = pymongo.MongoClient(URI, server_api=ServerApi('1'))

    doctor = client.get_database("MediCall").doctors
    patient = client.get_database("MediCall").patients

    return doctor, patient

