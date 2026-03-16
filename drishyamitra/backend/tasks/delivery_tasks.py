from celery import Celery
from models.database import db
from models.delivery_history import DeliveryHistory
from services.email_service import send_photo_email
from services.whatsapp_service import send_photo_whatsapp

# We use the same broker as in chat_tasks.py
celery = Celery("delivery_tasks", broker="redis://localhost:6379")

@celery.task(bind=True)
def async_send_email(self, delivery_history_id, to_email, photo_path):
    # Retrieve the Flask app context via some standard mechanism,
    # or rely on the function just doing standard python work outside of DB contexts.
    # Since DB updates can be tricky here, we will just call the service.
    # We might need to handle DB status updates if required.
    
    success = send_photo_email(to_email=to_email, photo_path=photo_path)
    # Ideally, we would update the delivery history ID status here:
    # However, Celery context lacks Flask context. For simple status updates,
    # let's assume successful processing if it returns True.
    return success

@celery.task(bind=True)
def async_send_whatsapp(self, delivery_history_id, to_number, photo_url):
    result = send_photo_whatsapp(to_number=to_number, photo_url=photo_url)
    return result is not None
