from flask import Blueprint, request, jsonify
from services.chat_service import process_query

chat_bp = Blueprint("chat_bp", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():

    data = request.json
    message = data.get("message")

    result = process_query(message)

    return jsonify(result)