import os
import logging
from groq import Groq

# Logging setup
logging.basicConfig(level=logging.INFO)

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key) if groq_api_key else None

# Current supported Groq model
MODEL = "llama-3.3-70b-versatile"


def ask_ai(message):
    """
    Sends a message to the Groq LLM and returns the response.
    """
    if not client:
        return "I am running in mock mode because no GROQ_API_KEY was found. I received your message: " + message

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are Drishyamitra, an AI assistant for a photo "
                        "management system. Help users manage photos, "
                        "deliver images, and search their gallery."
                    ),
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
        )

        return completion.choices[0].message.content

    except Exception as e:
        logging.error(f"Groq API error: {str(e)}")
        return "Sorry, I couldn't process your request right now."


def parse_intent(message):
    """
    Simple rule-based intent detection.
    """

    msg = message.lower()

    if "delivery" in msg:
        return "delivery_history"

    if "send" in msg and "photo" in msg:
        return "send_photo"

    if "show" in msg and "photo" in msg:
        return "search_photos"

    return "chat"


def process_query(message):
    """
    Main chatbot handler.
    Determines intent and triggers backend actions.
    """

    intent = parse_intent(message)

    if intent == "delivery_history":
        return {
            "action": "delivery_history",
            "message": "Fetching delivery history..."
        }

    if intent == "search_photos":
        return {
            "action": "search_photos",
            "message": "Searching your photo library..."
        }

    if intent == "send_photo":
        return {
            "action": "send_photo",
            "message": "Preparing to send the photo..."
        }

    # Fallback to AI response
    logging.warning(f"Unknown query intent: {message}")

    response = ask_ai(message)

    return {
        "action": "chat",
        "response": response
    }