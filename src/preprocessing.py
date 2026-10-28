import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
import os

class FeatureEngineer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.numerical_cols = []
        self.categorical_cols = []
        self.target_col = 'exam_score'
        self.id_col = 'student_id'
        
    def fit(self, X, y=None):
        # Auto-detect column types from X
        # Drop ID col if present (handled in transform usually, but good to know here)
        remaining_cols = [c for c in X.columns if c != self.id_col and c != self.target_col]
        
        self.numerical_cols = X[remaining_cols].select_dtypes(include=['int64', 'float64']).columns.tolist()
        self.categorical_cols = X[remaining_cols].select_dtypes(include=['object', 'category']).columns.tolist()
        
        print(f"Detected Numerical Columns: {self.numerical_cols}")
        print(f"Detected Categorical Columns: {self.categorical_cols}")
        return self

    def transform(self, X):
        X = X.copy()
        
        # Feature Engineering: Derived Features
        # 1. Study Efficiency = Study Hours / Sleep Hours (avoid div by zero)
        if 'study_hours' in X.columns and 'sleep_hours' in X.columns:
            X['study_efficiency'] = X['study_hours'] / (X['sleep_hours'] + 0.1)
        
        # 2. Total active time
        # if 'study_hours' in X.columns and 'class_attendance' in X.columns:
        # For attendance (%), lets assume standard class hours, maybe just use raw attendance
        
        # Drop ID column
        if self.id_col in X.columns:
            X = X.drop(columns=[self.id_col])
            
        return X

def get_preprocessing_pipeline(numerical_cols, categorical_cols):
    """
    Creates a sklearn ColumnTransformer for the specific columns.
    """
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)
        ],
        remainder='passthrough'  # Keep derived features if they aren't in the lists above?
        # Actually derived features might need to be added TO the lists or handled carefully.
        # For this design, we'll apply the FE step first, THEN get the full pipeline.
    )
    
    return preprocessor

def run_preprocessing(filepath):
    print("--- Phase 2: Feature Engineering & Preprocessing ---")
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return
    
    df = pd.read_csv(filepath)
    
    # 1. Feature Engineering Step (Custom Transformer)
    fe = FeatureEngineer()
    fe.fit(df) # Detects columns
    
    # We need to know the NEW columns after FE to pass to ColumnTransformer
    # So we apply FE transform temporarily to check structure
    df_transformed = fe.transform(df)
    
    # Re-detect columns on transformed data because features might have changed/added
    final_cols = [c for c in df_transformed.columns if c != 'exam_score']
    
    num_cols = df_transformed[final_cols].select_dtypes(include=['number']).columns.tolist()
    cat_cols = df_transformed[final_cols].select_dtypes(include=['object', 'category']).columns.tolist()
    
    print(f"Final Numeric Features: {num_cols}")
    print(f"Final Categorical Features: {cat_cols}")
    
    # 2. Build Full Pipeline
    preprocessor = get_preprocessing_pipeline(num_cols, cat_cols)
    
    # Split data
    X = df.drop(columns=['exam_score'])
    y = df['exam_score']
    
    # Full pipeline: FE -> Preprocessor
    full_pipeline = Pipeline(steps=[
        ('feature_engineering', fe),
        ('preprocessor', preprocessor)
    ])
    
    # Fit and Transform
    # Only Fit on Train to avoid leakage (standard practice)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    X_train_processed = full_pipeline.fit_transform(X_train)
    X_test_processed = full_pipeline.transform(X_test) # Transform only
    
    print(f"Train data shape after processing: {X_train_processed.shape}")
    print(f"Test data shape after processing: {X_test_processed.shape}")
    
    # Save artifacts
    os.makedirs("models", exist_ok=True)
    joblib.dump(full_pipeline, "models/preprocessing_pipeline.pkl")
    # Save split data for next steps
    pd.DataFrame(X_train_processed if not isinstance(X_train_processed, np.ndarray) else X_train_processed).to_csv("data/X_train_processed.csv", index=False)
    pd.DataFrame(X_test_processed if not isinstance(X_test_processed, np.ndarray) else X_test_processed).to_csv("data/X_test_processed.csv", index=False)
    y_train.to_csv("data/y_train.csv", index=False)
    y_test.to_csv("data/y_test.csv", index=False)
    
    print("Preprocessing pipeline and processed data saved.")

if __name__ == "__main__":
    filepath = os.path.join("data", "Exam_Score_Prediction.csv")
    if not os.path.exists(filepath):
         filepath = os.path.join("..", "data", "Exam_Score_Prediction.csv")
    
    run_preprocessing(filepath)
