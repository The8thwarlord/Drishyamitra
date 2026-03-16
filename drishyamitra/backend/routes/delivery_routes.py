from flask import Blueprint, jsonify

delivery_bp = Blueprint("delivery_bp", __name__)

@delivery_bp.route("/api/delivery/history", methods=["GET"])
def delivery_history():

    return jsonify({
        "message": "Delivery history endpoint working"
    })