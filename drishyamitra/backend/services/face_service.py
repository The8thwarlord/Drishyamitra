from deepface import DeepFace
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def generate_embedding(image_path):

    result = DeepFace.represent(
        img_path=image_path,
        model_name="Facenet512",
        detector_backend="retinaface"
    )

    embedding = result[0]["embedding"]

    return embedding


def detect_faces(image_path):

    try:
        # Use represent to extract both embeddings and facial area (boxes)
        results = DeepFace.represent(
            img_path=image_path,
            model_name="Facenet512",
            detector_backend="retinaface",
            enforce_detection=False # Don't error if 0 faces, just return empty list
        )
        
        # Deepface represent returns a list of dictionaries if faces are found
        # Each dict has 'embedding', 'facial_area' (x, y, w, h, etc), and 'face_confidence'
        return results
    except ValueError as e:
        if "Face could not be detected" in str(e):
             return []
        raise e


def compare_faces(embedding1, embedding2):

    similarity = cosine_similarity(
        [embedding1],
        [embedding2]
    )

    return float(similarity[0][0])