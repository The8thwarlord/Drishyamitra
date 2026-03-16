from flask import Blueprint, request, jsonify
from services.face_service import generate_embedding
from models.face import Face
from models.database import db

face_bp = Blueprint("face_bp", __name__)

@face_bp.route("/api/recognize", methods=["POST"])
def recognize_faces():

    data = request.json

    image_path = data.get("image_path")

    embedding = generate_embedding(image_path)

    face = Face(
        embedding=str(embedding)
    )

    db.session.add(face)
    db.session.commit()

    return jsonify({
        "message": "Face embedding stored"
    })