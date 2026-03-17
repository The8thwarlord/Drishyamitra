from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.database import db
from models.photo import Photo
from models.face import Face
from services.face_service import detect_faces
import os

photo_bp = Blueprint("photo_bp", __name__)

UPLOAD_FOLDER = "data"

@photo_bp.route("/api/upload", methods=["POST"])
# Temporarily bypassing JWT for frictionless dev, we will add back user context shortly via token
# @jwt_required()
def upload_photo():

    if "photo" not in request.files:
        if "file" in request.files:
            file = request.files["file"]
        else:
            return jsonify({"error": "No photo provided"}), 400
    else:
        file = request.files["photo"]

    # Save to top-level data/ folder
    os.makedirs(f"../{UPLOAD_FOLDER}", exist_ok=True)
    filepath = os.path.join(f"../{UPLOAD_FOLDER}", file.filename)
    file.save(filepath)

    # Hardcoding user mapping temporarily, you'd get this from JWT
    # user_id = get_jwt_identity() 
    user_id = 1 

    new_photo = Photo(file_path=filepath, user_id=user_id)
    db.session.add(new_photo)
    db.session.commit()

    # Process Faces
    try:
        faces_data = detect_faces(filepath)
        if faces_data:
             for face in faces_data:
                 area = face.get('facial_area', {})
                 new_face = Face(
                     embedding=str(face.get('embedding')),
                     photo_id=new_photo.id
                 )
                 # We can store box coordinates in Face logic if fields exist, 
                 # right now Face model only has embedding. Wait to modify model
                 # and just store the embedding for now.
                 db.session.add(new_face)
             db.session.commit()
    except Exception as e:
        print("Error during face detection:", e)

    return jsonify({
        "message": "Photo uploaded successfully",
        "file_path": filepath,
        "photo_id": new_photo.id
    })


@photo_bp.route("/api/photos", methods=["GET"])
def get_photos():
    photos = Photo.query.all()
    result = []
    for p in photos:
        faces = [{
            "id": f.id,
            "label": f.person_id, # Actually should map to person name, we will adapt this
            "confidence": 0.99, # Placeholder, deepface stores embedding
            "box_x": 0,
            "box_y": 0,
        } for f in p.faces]
        
        result.append({
            "id": p.id,
            "filename": os.path.basename(p.file_path),
            "faces": faces
        })
        
    return jsonify(result), 200


@photo_bp.route("/api/photos/download/<int:photo_id>", methods=["GET"])
def download_photo(photo_id):
    photo = Photo.query.get_or_404(photo_id)
    if os.path.exists(photo.file_path):
         return send_file(photo.file_path, mimetype='image/jpeg')
    elif os.path.exists(f"../{photo.file_path}"):
         return send_file(f"../{photo.file_path}", mimetype='image/jpeg')
    elif os.path.exists(photo.file_path.replace("../", "/app/")):
         return send_file(photo.file_path.replace("../", "/app/"), mimetype='image/jpeg')
    else:
        return jsonify({"error": "File not found"}), 404

@photo_bp.route("/api/photos/<int:photo_id>", methods=["DELETE"])
def delete_photo(photo_id):
    photo = Photo.query.get_or_404(photo_id)
    
    # Try deleting the physical file
    try:
        if os.path.exists(photo.file_path):
            os.remove(photo.file_path)
        elif os.path.exists(f"../{photo.file_path}"):
            os.remove(f"../{photo.file_path}")
        elif os.path.exists(photo.file_path.replace("../", "/app/")):
            os.remove(photo.file_path.replace("../", "/app/"))
    except Exception as e:
        print(f"Error deleting file {photo.file_path}: {e}")
        
    # Delete from DB (cascade should delete faces if set up, 
    # but let's be explicit and delete faces first just in case)
    Face.query.filter_by(photo_id=photo.id).delete()
    db.session.delete(photo)
    db.session.commit()
    
    return jsonify({"message": "Photo deleted successfully"}), 200