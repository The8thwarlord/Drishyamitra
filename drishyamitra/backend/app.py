import os
from dotenv import load_dotenv

load_dotenv()

print("Groq Key:", os.getenv("GROQ_API_KEY"))
print("Database:", os.getenv("DATABASE_URL"))