import os
import requests
import json

def send_photo_whatsapp(to_number: str, photo_url: str, caption="Here is the photo you requested."):
    """
    Sends a photo via WhatsApp using the Meta Cloud API.
    Requires WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in environment variables.
    """
    api_token = os.getenv("WHATSAPP_API_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")

    if not api_token or not phone_number_id:
        raise ValueError("WhatsApp API credentials are not set in the environment variables.")

    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/messages"

    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }

    # Format the phone number to E.164 without the '+'
    # Meta's API expects the number starting with the country code (e.g., 14155552671)
    to_number = ''.join(filter(str.isdigit, to_number))

    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_number,
        "type": "image",
        "image": {
            "link": photo_url,
            "caption": caption
        }
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status() # Raise an exception for HTTP errors
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Failed to send WhatsApp message: {e}")
        if e.response is not None:
            print(f"Response data: {e.response.text}")
        return None
