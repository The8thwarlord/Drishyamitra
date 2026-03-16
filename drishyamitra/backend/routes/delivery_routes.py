from flask import Blueprint, jsonify, request
from models.database import db
from models.delivery_history import DeliveryHistory
from tasks.delivery_tasks import async_send_email, async_send_whatsapp
import os

delivery_bp = Blueprint("delivery_bp", __name__)

@delivery_bp.route("/api/delivery/history", methods=["GET"])
def delivery_history():
    return jsonify({
        "message": "Delivery history endpoint working"
    })

@delivery_bp.route("/api/delivery/email", methods=["POST"])
def delivery_email():
    data = request.json
    to_email = data.get("to_email")
    photo_path = data.get("photo_path")
    photo_id = data.get("photo_id") # optional, for tracking

    if not to_email or not photo_path:
        return jsonify({"error": "Missing to_email or photo_path"}), 400

    # Create DeliveryHistory record
    history = DeliveryHistory(
        photo_id=photo_id,
        delivery_type="email",
        destination=to_email
    )
    db.session.add(history)
    db.session.commit()

    # Trigger Celery task
    async_send_email.delay(history.id, to_email, photo_path)

    return jsonify({"message": "Email delivery initiated", "history_id": history.id}), 202

@delivery_bp.route("/api/delivery/whatsapp", methods=["POST"])
def delivery_whatsapp():
    data = request.json
    to_number = data.get("to_number")
    photo_url = data.get("photo_url")
    photo_id = data.get("photo_id") # optional, for tracking

    if not to_number or not photo_url:
        return jsonify({"error": "Missing to_number or photo_url"}), 400

    # Create DeliveryHistory record
    history = DeliveryHistory(
        photo_id=photo_id,
        delivery_type="whatsapp",
        destination=to_number
    )
    db.session.add(history)
    db.session.commit()

    # Trigger Celery task
    async_send_whatsapp.delay(history.id, to_number, photo_url)

    return jsonify({"message": "WhatsApp delivery initiated", "history_id": history.id}), 202