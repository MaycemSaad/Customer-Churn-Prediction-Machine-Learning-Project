from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from typing import List
import os

app = FastAPI(
    title="Churn Prediction API",
    description="API for predicting customer churn",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle et les artefacts
try:
    model = joblib.load("app/models/best_churn_model.pkl")
    scaler = joblib.load("app/models/scaler.pkl")
    feature_names = joblib.load("app/models/feature_names.pkl")
    print("✅ Modèles chargés avec succès")
except Exception as e:
    print(f"❌ Erreur lors du chargement des modèles: {e}")
    # Créer des modèles factices pour le développement
    model = None
    scaler = None
    feature_names = []

class PredictionInput(BaseModel):
    account_length: float
    international_plan: int
    voice_mail_plan: int
    number_vmail_messages: float
    total_day_minutes: float
    total_day_calls: float
    total_day_charge: float
    total_eve_minutes: float
    total_eve_calls: float
    total_eve_charge: float
    total_night_minutes: float
    total_night_calls: float
    total_night_charge: float
    total_intl_minutes: float
    total_intl_calls: float
    total_intl_charge: float
    customer_service_calls: float

class PredictionResponse(BaseModel):
    churn_probability: float
    prediction: int
    confidence: float
    message: str

@app.get("/")
async def root():
    return {"message": "Churn Prediction API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_churn(input_data: PredictionInput):
    try:
        if model is None or scaler is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Convertir l'input en DataFrame
        input_dict = input_data.dict()
        features = pd.DataFrame([input_dict])
        
        # S'assurer que les colonnes sont dans le bon ordre
        features = features.reindex(columns=feature_names, fill_value=0)
        
        # Standardiser les features
        features_scaled = scaler.transform(features)
        
        # Prédiction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0][1]
        
        message = "Customer likely to churn" if prediction == 1 else "Customer likely to stay"
        
        return PredictionResponse(
            churn_probability=float(probability),
            prediction=int(prediction),
            confidence=float(probability if prediction == 1 else 1 - probability),
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
