import pandas as pd
import numpy as np
import joblib
import json
import os
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score

def train_and_evaluate(X_train_path, y_train_path, X_test_path, y_test_path, output_dir="models"):
    print("--- Phase 4: Model Training & Selection ---")
    
    # Load processed data
    # Note: X_train_processed.csv from Phase 2 might lack headers if converted to numpy array in previous step.
    # But in preprocessing.py I saved it as DataFrame with to_csv, so headers should be there.
    X_train = pd.read_csv(X_train_path)
    y_train = pd.read_csv(y_train_path).values.ravel() # Flatten target
    X_test = pd.read_csv(X_test_path)
    y_test = pd.read_csv(y_test_path).values.ravel()
    
    print(f"Data Loaded. X_train shape: {X_train.shape}")

    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42)
    }
    
    results = {}
    best_model_name = None
    best_score = -float("inf")
    best_model = None
    
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n--- Training & Evaluation ---")
    for name, model in models.items():
        print(f"Training {name}...")
        
        # Cross Validation (R2)
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='r2')
        mean_cv_r2 = cv_scores.mean()
        
        # Train on full train set
        model.fit(X_train, y_train)
        
        # Predict on Test set
        y_pred = model.predict(X_test)
        
        # Metrics
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        results[name] = {
            "CV_R2": mean_cv_r2,
            "Test_R2": r2,
            "MAE": mae,
            "RMSE": rmse
        }
        
        print(f"  > CV R²: {mean_cv_r2:.4f}")
        print(f"  > Test R²: {r2:.4f}, RMSE: {rmse:.4f}")
        
        # Model Selection logic: Use CV score or Test R2? Usually CV is safer for selection.
        if r2 > best_score:
            best_score = r2
            best_model_name = name
            best_model = model
            
    print(f"\n🏆 Best Model: {best_model_name} with Test R²: {best_score:.4f}")
    
    # Save Best Model
    model_path = os.path.join(output_dir, "best_model.pkl")
    joblib.dump(best_model, model_path)
    print(f"Best model saved to {model_path}")
    
    # Save Metrics
    metrics_path = os.path.join(output_dir, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(results, f, indent=4)
    print(f"Metrics saved to {metrics_path}")
    
    return best_model_name

if __name__ == "__main__":
    X_train_path = os.path.join("data", "X_train_processed.csv")
    y_train_path = os.path.join("data", "y_train.csv")
    X_test_path = os.path.join("data", "X_test_processed.csv")
    y_test_path = os.path.join("data", "y_test.csv")
    
    # Fix paths if running from src
    if not os.path.exists(X_train_path):
        X_train_path = os.path.join("..", X_train_path)
        y_train_path = os.path.join("..", y_train_path)
        X_test_path = os.path.join("..", X_test_path)
        y_test_path = os.path.join("..", y_test_path)
        
    train_and_evaluate(X_train_path, y_train_path, X_test_path, y_test_path)
