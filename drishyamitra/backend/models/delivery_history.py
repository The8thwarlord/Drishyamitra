from models.database import db
from datetime import datetime

class DeliveryHistory(db.Model):

    __tablename__ = "delivery_history"

    id = db.Column(db.Integer, primary_key=True)

    photo_id = db.Column(db.Integer, db.ForeignKey("photos.id"))

    delivery_type = db.Column(db.String(50))

    destination = db.Column(db.String(255))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)    