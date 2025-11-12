import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, roc_auc_score
import joblib
import os
import json
from datetime import datetime

def advanced_model_training():
    print("🔮 Entraînement avancé du modèle de prédiction de churn...")
    
    try:
        data = pd.read_csv('churn-bigml-80.csv')
        print("✅ Données chargées avec succès")
    except FileNotFoundError:
        print("📝 Création de données d'exemple avancées...")
        np.random.seed(42)
        n_samples = 2000
        
        data = pd.DataFrame({
            'Account length': np.random.randint(1, 300, n_samples),
            'International plan': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
            'Voice mail plan': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
            'Number vmail messages': np.random.poisson(10, n_samples),
            'Total day minutes': np.random.normal(180, 50, n_samples),
            'Total day calls': np.random.poisson(100, n_samples),
            'Total day charge': np.random.normal(30, 8, n_samples),
            'Total eve minutes': np.random.normal(200, 40, n_samples),
            'Total eve calls': np.random.poisson(100, n_samples),
            'Total eve charge': np.random.normal(17, 4, n_samples),
            'Total night minutes': np.random.normal(200, 45, n_samples),
            'Total night calls': np.random.poisson(100, n_samples),
            'Total night charge': np.random.normal(9, 2, n_samples),
            'Total intl minutes': np.random.exponential(10, n_samples),
            'Total intl calls': np.random.poisson(4, n_samples),
            'Total intl charge': np.random.exponential(2.7, n_samples),
            'Customer service calls': np.random.poisson(2, n_samples),
            'Churn': np.random.choice([0, 1], n_samples, p=[0.85, 0.15])
        })
        
        # Ajouter des relations complexes
        data.loc[data['Customer service calls'] > 4, 'Churn'] = 1
        data.loc[(data['International plan'] == 1) & (data['Total day minutes'] < 100), 'Churn'] = 1
        
        data.to_csv('churn-bigml-80.csv', index=False)
        print("✅ Données d'exemple créées et sauvegardées")
    
    # Feature engineering avancé
    data['Total minutes'] = data['Total day minutes'] + data['Total eve minutes'] + data['Total night minutes']
    data['Total calls'] = data['Total day calls'] + data['Total eve calls'] + data['Total night calls']
    data['Avg call duration'] = data['Total minutes'] / data['Total calls']
    data['Service call ratio'] = data['Customer service calls'] / data['Total calls']
    
    # Encoder les variables
    encoder = LabelEncoder()
    categorical_columns = ['International plan', 'Voice mail plan']
    for col in categorical_columns:
        if col in data.columns and data[col].dtype == 'object':
            data[col] = encoder.fit_transform(data[col])
    
    # Préparation des features
    features_to_drop = ['Churn', 'State'] if 'State' in data.columns else ['Churn']
    X = data.drop(columns=features_to_drop, errors='ignore')
    y = data['Churn']
    
    # Split des données
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Standardisation
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Entraînement de multiple modèles
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=200, random_state=42, max_depth=15),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    best_model = None
    best_score = 0
    model_results = {}
    
    for name, model in models.items():
        print(f"🏋️  Entraînement du modèle: {name}")
        
        # Validation croisée
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='accuracy')
        
        # Entraînement final
        model.fit(X_train_scaled, y_train)
        
        # Prédictions
        y_pred = model.predict(X_test_scaled)
        y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
        
        # Métriques
        accuracy = accuracy_score(y_test, y_pred)
        auc_score = roc_auc_score(y_test, y_pred_proba)
        
        model_results[name] = {
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std(),
            'accuracy': accuracy,
            'auc_score': auc_score,
            'feature_importance': dict(zip(X.columns, model.feature_importances_)) if hasattr(model, 'feature_importances_') else {}
        }
        
        print(f"📊 {name} - Accuracy: {accuracy:.3f}, AUC: {auc_score:.3f}")
        
        if auc_score > best_score:
            best_score = auc_score
            best_model = model
    
    # Sauvegarde du meilleur modèle
    os.makedirs('app/models', exist_ok=True)
    
    joblib.dump(best_model, 'app/models/best_churn_model.pkl')
    joblib.dump(scaler, 'app/models/scaler.pkl')
    joblib.dump(X.columns.tolist(), 'app/models/feature_names.pkl')
    
    # Sauvegarde des métriques
    metrics = {
        'training_date': datetime.now().isoformat(),
        'best_model': 'Random Forest' if isinstance(best_model, RandomForestClassifier) else 'Gradient Boosting',
        'best_auc_score': best_score,
        'model_comparison': model_results,
        'feature_names': X.columns.tolist()
    }
    
    with open('app/models/training_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print("✅ Entraînement avancé terminé!")
    print(f"🎯 Meilleur modèle: AUC = {best_score:.3f}")
    print("📈 Comparaison des modèles:")
    for name, results in model_results.items():
        print(f"   {name}: Accuracy={results['accuracy']:.3f}, AUC={results['auc_score']:.3f}")

if __name__ == "__main__":
    advanced_model_training()