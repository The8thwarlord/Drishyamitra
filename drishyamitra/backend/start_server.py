from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "Drishyamitra backend running",
        "status": "success"
    })

@app.route("/api/test")
def test():
    return jsonify({
        "api": "working"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)