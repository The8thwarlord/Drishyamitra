from celery import Celery
from services.chat_service import ask_ai

celery = Celery("tasks", broker="redis://localhost:6379")

@celery.task
def async_chat(message):
    return ask_ai(message)