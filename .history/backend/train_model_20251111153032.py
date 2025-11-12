@"
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_and_save_model():
    print("🔮 Entraînement du modèle de prédiction de churn...")
    
    # Charger les données (adaptez le chemin)
    try:
        data = pd.read_csv('churn-bigml-80.csv')
        data_test = pd.read_csv('churn-bigml-20.csv')
        print("✅ Données chargées avec succès")
    except FileNotFoundError:
        print("📝 Création de données d'exemple pour le développement...")
        # Créer des données d'exemple
        np.random.seed(42)
        n_samples = 1000
        
        data = pd.DataFrame({
            'Account length': np.random.randint(1, 300, n_samples),
            'International plan': np.random.choice([0, 1], n_samples),
            'Voice mail plan': np.random.choice([0, 1], n_samples),
            'Number vmail messages': np.random.randint(0, 50, n_samples),
            'Total day minutes': np.random.uniform(0, 350, n_samples),
            'Total day calls': np.random.randint(0, 200, n_samples),
            'Total day charge': np.random.uniform(0, 60, n_samples),
            'Total eve minutes': np.random.uniform(0, 350, n_samples),
            'Total eve calls': np.random.randint(0, 200, n_samples),
            'Total eve charge': np.random.uniform(0, 30, n_samples),
            'Total night minutes': np.random.uniform(0, 350, n_samples),
            'Total night calls': np.random.randint(0, 200, n_samples),
            'Total night charge': np.random.uniform(0, 20, n_samples),
            'Total intl minutes': np.random.uniform(0, 20, n_samples),
            'Total intl calls': np.random.randint(0, 20, n_samples),
            'Total intl charge': np.random.uniform(0, 5, n_samples),
            'Customer service calls': np.random.randint(0, 10, n_samples),
            'Churn': np.random.choice([0, 1], n_samples, p=[0.85, 0.15])
        })
        
        data_test = data.sample(200)
    
    # Encoder les variables catégorielles
    encoder = LabelEncoder()
    if 'International plan' in data.columns and data['International plan'].dtype == 'object':
        data['International plan'] = encoder.fit_transform(data['International plan'])
    if 'Voice mail plan' in data.columns and data['Voice mail plan'].dtype == 'object':
        data['Voice mail plan'] = encoder.fit_transform(data['Voice mail plan'])
    
    # Préparer les features et la target
    features_to_drop = ['Churn', 'State'] if 'State' in data.columns else ['Churn']
    X = data.drop(columns=features_to_drop, errors='ignore')
    y = data['Churn']
    
    # Standardiser les features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Entraîner le modèle
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10
    )
    
    model.fit(X_scaled, y)
    
    # Sauvegarder le modèle et les artefacts
    os.makedirs('app/models', exist_ok=True)
    
    joblib.dump(model, 'app/models/best_churn_model.pkl')
    joblib.dump(scaler, 'app/models/scaler.pkl')
    joblib.dump(X.columns.tolist(), 'app/models/feature_names.pkl')
    
    print("✅ Modèle entraîné et sauvegardé avec succès!")
    print(f"📊 Features utilisées: {X.columns.tolist()}")
    print(f"🎯 Accuracy sur l'ensemble d'entraînement: {model.score(X_scaled, y):.3f}")

if __name__ == "__main__":
    train_and_save_model()
"@ | Out-File -FilePath "backend\train_model.py" -Encoding utf8