from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
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

# Variables pour le modèle
model = None
scaler = None
feature_names = None

class PredictionInput(BaseModel):
    account_length: float = 100.0
    international_plan: int = 0
    voice_mail_plan: int = 0
    number_vmail_messages: float = 0.0
    total_day_minutes: float = 200.0
    total_day_calls: float = 100.0
    total_day_charge: float = 30.0
    total_eve_minutes: float = 200.0
    total_eve_calls: float = 100.0
    total_eve_charge: float = 15.0
    total_night_minutes: float = 200.0
    total_night_calls: float = 100.0
    total_night_charge: float = 10.0
    total_intl_minutes: float = 10.0
    total_intl_calls: float = 5.0
    total_intl_charge: float = 3.0
    customer_service_calls: float = 2.0

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
        # Pour le développement, simuler une prédiction
        # En production, vous chargeriez le vrai modèle
        mock_probability = 0.25  # 25% de chance de churn
        mock_prediction = 0  # Pas de churn
        mock_confidence = 0.85  # 85% de confiance
        
        message = "Customer likely to churn" if mock_prediction == 1 else "Customer likely to stay"
        
        return PredictionResponse(
            churn_probability=float(mock_probability),
            prediction=int(mock_prediction),
            confidence=float(mock_confidence),
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Churn Prediction API on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)