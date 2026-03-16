from models.database import db
from datetime import datetime

class Photo(db.Model):

    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)

    file_path = db.Column(db.String(255), nullable=False)

    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    faces = db.relationship("Face", backref="photo", cascade="all, delete")