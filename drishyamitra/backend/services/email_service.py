import smtplib
from email.message import EmailMessage
import os
import mimetypes

def send_photo_email(to_email: str, photo_path: str, subject="Your Photo from Drishyamitra", body="Here is the photo you requested."):
    """
    Sends an email with a photo attachment using Gmail SMTP.
    Requires GMAIL_USER and GMAIL_APP_PASSWORD in environment variables.
    """
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")

    if not gmail_user or not gmail_password:
        raise ValueError("Gmail credentials are not set in the environment variables.")

    if not os.path.exists(photo_path):
        raise FileNotFoundError(f"Photo path does not exist: {photo_path}")

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = gmail_user
    msg['To'] = to_email
    msg.set_content(body)

    # Automatically detect the mime type of the photo
    ctype, encoding = mimetypes.guess_type(photo_path)
    if ctype is None or encoding is not None:
        ctype = 'application/octet-stream'
    maintype, subtype = ctype.split('/', 1)

    with open(photo_path, 'rb') as fp:
        photo_data = fp.read()

    msg.add_attachment(photo_data, maintype=maintype, subtype=subtype, filename=os.path.basename(photo_path))

    # Send the email via Gmail SMTP
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(gmail_user, gmail_password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
