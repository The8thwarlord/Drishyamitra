import os
from datetime import timedelta
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager

from models.database import db
from routes.auth_routes import auth_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback_secret_key")

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
CORS(app)

api = Api(app)

@app.route("/")
def home():
    return {"message": "Drishyamitra backend running"}


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)



from routes.photo_routes import photo_bp
from routes.face_routes import face_bp
from routes.chat_routes import chat_bp
from routes.delivery_routes import delivery_bp

app.register_blueprint(photo_bp)
app.register_blueprint(face_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(delivery_bp)

with app.app_context():
    db.create_all()


