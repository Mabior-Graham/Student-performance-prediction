import pandas as pd
import sys
import os

# Add the current directory to path to import utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from src.utils import load_data, get_column_info

def analyze_dataset(filepath):
    print("--- Phase 1: Dataset Understanding ---")
    
    df = load_data(filepath)
    
    print("\n--- Column Analysis ---")
    info = get_column_info(df)
    print(info)
    
    print("\n--- Target Variable Detection ---")
    # Heuristic: Look for score-related keywords
    potential_targets = [col for col in df.columns if any(keyword in col.lower() for keyword in ['score', 'grade', 'result', 'mark', 'performance'])]
    
    if potential_targets:
        print(f"Potential target columns detected: {potential_targets}")
        # Simple heuristic: prioritize 'Exam_Score' or similar if exact match, else take the last numeric one?
        # For now just list them.
    else:
        print("No obvious target column detected based on keywords.")

    return df

if __name__ == "__main__":
    # Assuming run from root
    filepath = os.path.join("data", "Exam_Score_Prediction.csv")
    if not os.path.exists(filepath):
        # Fallback if running from src
        filepath = os.path.join("..", "data", "Exam_Score_Prediction.csv")
        
    analyze_dataset(filepath)
