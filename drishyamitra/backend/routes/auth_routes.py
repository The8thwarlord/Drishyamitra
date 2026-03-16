from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User
from models.database import db
import bcrypt

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user = User(email=email, password_hash=hashed.decode("utf-8"))

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})


@auth_bp.route("/api/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token
    })