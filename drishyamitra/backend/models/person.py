from models.database import db
from datetime import datetime

class Person(db.Model):

    __tablename__ = "persons"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    faces = db.relationship("Face", backref="person")   