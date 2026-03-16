from flask import Blueprint, request, jsonify
from services.face_service import detect_faces

face_bp = Blueprint("face_bp", __name__)

@face_bp.route("/api/recognize", methods=["POST"])
def recognize_faces():

    data = request.json
    image_path = data.get("image_path")

    if not image_path:
        return jsonify({"error": "image_path required"}), 400

    faces = detect_faces(image_path)

    return jsonify({
        "faces_detected": faces
    })