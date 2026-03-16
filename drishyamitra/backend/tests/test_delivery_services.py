import unittest
from unittest.mock import patch, MagicMock
from services.email_service import send_photo_email
from services.whatsapp_service import send_photo_whatsapp
import os

class TestDeliveryServices(unittest.TestCase):

    @patch('services.email_service.os.getenv')
    @patch('services.email_service.smtplib.SMTP_SSL')
    @patch('services.email_service.os.path.exists')
    @patch('builtins.open', new_callable=unittest.mock.mock_open, read_data=b'data')
    def test_send_photo_email_success(self, mock_file, mock_exists, mock_smtp, mock_getenv):
        # Mock environment variables
        mock_getenv.side_effect = lambda k: "mock_value" if k in ["GMAIL_USER", "GMAIL_APP_PASSWORD"] else None
        mock_exists.return_value = True

        # Mock SMTP server
        mock_server = MagicMock()
        mock_smtp.return_value.__enter__.return_value = mock_server

        result = send_photo_email("test@example.com", "fake/path.jpg")

        self.assertTrue(result)
        mock_server.login.assert_called_once_with("mock_value", "mock_value")
        mock_server.send_message.assert_called_once()

    @patch('services.whatsapp_service.os.getenv')
    @patch('services.whatsapp_service.requests.post')
    def test_send_photo_whatsapp_success(self, mock_post, mock_getenv):
        # Mock environment variables
        mock_getenv.side_effect = lambda k: "mock_value" if k in ["WHATSAPP_API_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"] else None

        # Mock requests.post response
        mock_response = MagicMock()
        mock_response.json.return_value = {"messages": [{"id": "wamid.123"}]}
        mock_post.return_value = mock_response

        result = send_photo_whatsapp("+1234567890", "http://example.com/photo.jpg")

        self.assertIsNotNone(result)
        self.assertEqual(result, {"messages": [{"id": "wamid.123"}]})
        
        # Verify normalization of phone number
        args, kwargs = mock_post.call_args
        self.assertEqual(kwargs['json']['to'], "1234567890")

if __name__ == '__main__':
    unittest.main()
