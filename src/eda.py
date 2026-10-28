import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
import sys

# Add src to path if needed (though we likely run from root)
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def set_style():
    sns.set_theme(style="whitegrid")
    plt.rcParams["figure.figsize"] = (10, 6)
    plt.rcParams["axes.titlesize"] = 16
    plt.rcParams["axes.labelsize"] = 12

def plot_correlation_heatmap(df: pd.DataFrame, output_dir: str):
    plt.figure(figsize=(12, 10))
    # Select only numeric columns for correlation
    numeric_df = df.select_dtypes(include=['number'])
    # Drop ID if present
    if 'student_id' in numeric_df.columns:
        numeric_df = numeric_df.drop(columns=['student_id'])
        
    corr = numeric_df.corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
    plt.title("Feature Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "correlation_heatmap.png"))
    plt.close()
    print("Generated: correlation_heatmap.png")

def plot_distributions(df: pd.DataFrame, output_dir: str):
    numeric_cols = df.select_dtypes(include=['number']).columns
    numeric_cols = [c for c in numeric_cols if c not in ['student_id', 'exam_score']]
    
    for col in numeric_cols:
        plt.figure(figsize=(8, 5))
        sns.histplot(df[col], kde=True, color='skyblue')
        plt.title(f"Distribution of {col}")
        plt.xlabel(col)
        plt.ylabel("Frequency")
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, f"dist_{col}.png"))
        plt.close()
    
    # Target Variable Distribution
    plt.figure(figsize=(8, 5))
    sns.histplot(df['exam_score'], kde=True, color='purple')
    plt.title("Distribution of Target: Exam Score")
    plt.xlabel("Exam Score")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "dist_exam_score.png"))
    plt.close()
    print("Generated: Feature & Target distribution plots")

def plot_categorical_boxplots(df: pd.DataFrame, output_dir: str):
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    
    for col in categorical_cols:
        plt.figure(figsize=(10, 6))
        # Sort by median score to make plot readable
        order = df.groupby(col)['exam_score'].median().sort_values().index
        sns.boxplot(x=col, y='exam_score', data=df, order=order, palette="viridis")
        plt.title(f"Exam Score vs {col}")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, f"boxplot_{col}.png"))
        plt.close()
    print("Generated: Categorical boxplots")

def generate_eda(filepath, output_dir="plots"):
    print("--- Phase 3: Exploratory Data Analysis ---")
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    df = pd.read_csv(filepath)
    os.makedirs(output_dir, exist_ok=True)
    set_style()
    
    plot_correlation_heatmap(df, output_dir)
    plot_distributions(df, output_dir)
    plot_categorical_boxplots(df, output_dir)
    
    print(f"All plots saved to {output_dir}/")

if __name__ == "__main__":
    filepath = os.path.join("data", "Exam_Score_Prediction.csv")
    if not os.path.exists(filepath):
        filepath = os.path.join("..", "data", "Exam_Score_Prediction.csv")
        
    generate_eda(filepath)
