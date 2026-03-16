from models.database import db

class Face(db.Model):

    __tablename__ = "faces"

    id = db.Column(db.Integer, primary_key=True)

    embedding = db.Column(db.Text)

    photo_id = db.Column(db.Integer, db.ForeignKey("photos.id"))

    person_id = db.Column(db.Integer, db.ForeignKey("persons.id"))  