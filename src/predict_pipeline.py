import joblib
import pandas as pd
import os
import sys

# Ensure src is in path so pickle can find FeatureEngineer class if needed
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
# We need to import FeatureEngineer because it's part of the pickled pipeline
from src.preprocessing import FeatureEngineer

class PredictPipeline:
    def __init__(self, model_dir="models"):
        self.model_dir = model_dir
        self.preprocessor_path = os.path.join(model_dir, "preprocessing_pipeline.pkl")
        self.model_path = os.path.join(model_dir, "best_model.pkl")
        
        self.preprocessor = self._load_object(self.preprocessor_path)
        self.model = self._load_object(self.model_path)
        
    def _load_object(self, path):
        if not os.path.exists(path):
            # Fallback for running from src/ or tests/
            path_up = os.path.join("..", path)
            if os.path.exists(path_up):
                return joblib.load(path_up)
            raise FileNotFoundError(f"Artifact not found at {path}")
        return joblib.load(path)

    def predict(self, input_data: dict) -> float:
        """
        Args:
            input_data (dict): Dictionary identifying single student features.
        Returns:
            float: Predicted exam score.
        """
        # Convert dict to DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Preprocess (Feature Engineering + Scaling/Encoding)
        processed_data = self.preprocessor.transform(input_df)
        
        # Predict
        prediction = self.model.predict(processed_data)
        
        return round(float(prediction[0]), 2)

if __name__ == "__main__":
    # Test Run
    pipeline = PredictPipeline(model_dir="models")
    
    # Sample input based on dataset columns
    sample_input = {
        'age': 20,
        'gender': 'Female', # Case sensitivity might be handled by OneHotEncoder if categories match
        'course': 'Engineering',
        'study_hours': 6.5,
        'class_attendance': 90,
        'internet_access': 'Yes',
        'sleep_hours': 7,
        'sleep_quality': 'Good',
        'study_method': 'Self-Study',
        'facility_rating': 'High',
        'exam_difficulty': 'Medium'
    }
    
    # Note: Categorical values must match what was seen during training.
    # In a real app we would validate these against the allowed unique values.
    
    try:
        score = pipeline.predict(sample_input)
        print(f"Input: {sample_input}")
        print(f"Predicted Exam Score: {score}")
    except Exception as e:
        print(f"Prediction failed: {e}")
