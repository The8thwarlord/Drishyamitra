from flask_restful import Resource
from flask import request
import os

UPLOAD_FOLDER = "data"

class UploadPhoto(Resource):

    def post(self):
        if "photo" not in request.files:
            return {"error": "No photo provided"}, 400

        file = request.files["photo"]
        path = os.path.join(UPLOAD_FOLDER, file.filename)

        file.save(path)

        return {
            "message": "Photo uploaded successfully",
            "filename": file.filename
        }, 200