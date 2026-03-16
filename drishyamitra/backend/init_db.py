from config import engine
from models.base import Base

# Import models so SQLAlchemy registers them
from models.user import User
from models.photo import Photo
from models.face import Face
from models.person import Person
from models.delivery_history import DeliveryHistory

print("Initializing database...")

Base.metadata.create_all(bind=engine)

print("Database schema created successfully.")