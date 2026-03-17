import bcrypt
import time

start = time.time()
hashed = bcrypt.hashpw(b"password", bcrypt.gensalt(4))
print(f"Time taken to hash with 4 rounds: {time.time() - start}")

start = time.time()
bcrypt.checkpw(b"password", hashed)
print(f"Time taken to check with 4 rounds: {time.time() - start}")

start = time.time()
hashed = bcrypt.hashpw(b"password", bcrypt.gensalt())
print(f"Time taken to hash with default rounds: {time.time() - start}")

start = time.time()
bcrypt.checkpw(b"password", hashed)
print(f"Time taken to check with default rounds: {time.time() - start}")
