from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import os

photo_bp = Blueprint("photo_bp", __name__)

UPLOAD_FOLDER = "data"

@photo_bp.route("/api/upload", methods=["POST"])
@jwt_required()
def upload_photo():

    if "photo" not in request.files:
        return jsonify({"error": "No photo provided"}), 400

    file = request.files["photo"]

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)

    file.save(filepath)

    return jsonify({
        "message": "Photo uploaded successfully",
        "file_path": filepath
    })