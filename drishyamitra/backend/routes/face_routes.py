from flask import Blueprint, request, jsonify
from services.face_service import generate_embedding
from models.face import Face
from models.person import Person
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

@face_bp.route("/api/faces/<int:face_id>/label", methods=["POST"])
def label_face(face_id):
    data = request.json
    person_name = data.get("person_name")
    
    if not person_name:
        return jsonify({"error": "Person name required"}), 400
        
    face = Face.query.get_or_404(face_id)
    
    # Check if person exists
    person = Person.query.filter_by(name=person_name).first()
    if not person:
        person = Person(name=person_name)
        db.session.add(person)
        db.session.flush()
        
    face.person_id = person.id
    db.session.commit()
    
    return jsonify({
        "message": "Face labeled successfully",
        "person_id": person.id,
        "person_name": person.name
    })