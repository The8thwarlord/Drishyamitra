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

    faces = DeepFace.extract_faces(
        img_path=image_path,
        detector_backend="retinaface"
    )

    return faces


def compare_faces(embedding1, embedding2):

    similarity = cosine_similarity(
        [embedding1],
        [embedding2]
    )

    return float(similarity[0][0])