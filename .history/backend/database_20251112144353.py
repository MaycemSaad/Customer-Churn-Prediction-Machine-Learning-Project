import motor.motor_asyncio
from config import settings
from datetime import datetime
from typing import List, Dict, Any, Optional
from bson import ObjectId
import json

class MongoDB:
    def __init__(self):
        self.client = None
        self.database = None
        
    async def connect(self):
        """Établir la connexion à MongoDB"""
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
            self.database = self.client[settings.DATABASE_NAME]
            print("✅ Connecté à MongoDB avec succès!")
        except Exception as e:
            print(f"❌ Erreur de connexion MongoDB: {e}")
            raise
    
    async def close(self):
        """Fermer la connexion"""
        if self.client:
            self.client.close()
    
    async def save_prediction(self, prediction_data: Dict[str, Any]) -> str:
        """Sauvegarder une prédiction"""
        prediction_data["created_at"] = datetime.now()
        result = await self.database[settings.COLLECTION_PREDICTIONS].insert_one(prediction_data)
        return str(result.inserted_id)
    
    async def get_predictions(self, limit: int = 50, skip: int = 0) -> List[Dict]:
        """Récupérer les prédictions avec pagination"""
        cursor = self.database[settings.COLLECTION_PREDICTIONS].find().sort("created_at", -1).skip(skip).limit(limit)
        predictions = await cursor.to_list(length=limit)
        
        # Convertir ObjectId en string
        for pred in predictions:
            pred["_id"] = str(pred["_id"])
            if "created_at" in pred and isinstance(pred["created_at"], datetime):
                pred["created_at"] = pred["created_at"].isoformat()
        
        return predictions
    
    async def get_predictions_count(self) -> int:
        """Compter le nombre total de prédictions"""
        return await self.database[settings.COLLECTION_PREDICTIONS].count_documents({})
    
    async def get_predictions_by_date(self, date: datetime) -> List[Dict]:
        """Récupérer les prédictions d'une date spécifique"""
        start_of_day = datetime(date.year, date.month, date.day)
        end_of_day = datetime(date.year, date.month, date.day, 23, 59, 59)
        
        cursor = self.database[settings.COLLECTION_PREDICTIONS].find({
            "created_at": {"$gte": start_of_day, "$lte": end_of_day}
        })
        return await cursor.to_list(length=1000)
    
    async def get_high_risk_predictions(self) -> List[Dict]:
        """Récupérer les prédictions à haut risque"""
        cursor = self.database[settings.COLLECTION_PREDICTIONS].find({
            "risk_level": "HIGH"
        }).sort("created_at", -1)
        return await cursor.to_list(length=100)
    
    async def save_customer(self, customer_data: Dict[str, Any]) -> str:
        """Sauvegarder un client"""
        customer_data["created_at"] = datetime.now()
        customer_data["updated_at"] = datetime.now()
        
        # Vérifier si le client existe déjà
        existing = await self.database[settings.COLLECTION_CUSTOMERS].find_one({
            "customer_id": customer_data.get("customer_id")
        })
        
        if existing:
            # Mettre à jour
            await self.database[settings.COLLECTION_CUSTOMERS].update_one(
                {"_id": existing["_id"]},
                {"$set": customer_data}
            )
            return str(existing["_id"])
        else:
            # Créer nouveau
            result = await self.database[settings.COLLECTION_CUSTOMERS].insert_one(customer_data)
            return str(result.inserted_id)
    
    async def get_customers(self, limit: int = 50) -> List[Dict]:
        """Récupérer la liste des clients"""
        cursor = self.database[settings.COLLECTION_CUSTOMERS].find().sort("created_at", -1).limit(limit)
        customers = await cursor.to_list(length=limit)
        
        for customer in customers:
            customer["_id"] = str(customer["_id"])
            if "created_at" in customer and isinstance(customer["created_at"], datetime):
                customer["created_at"] = customer["created_at"].isoformat()
        
        return customers
    
    async def save_model_metrics(self, metrics: Dict[str, Any]) -> str:
        """Sauvegarder les métriques du modèle"""
        metrics["saved_at"] = datetime.now()
        
        # Supprimer l'ancienne entrée et créer une nouvelle
        await self.database[settings.COLLECTION_MODEL_METRICS].delete_many({})
        result = await self.database[settings.COLLECTION_MODEL_METRICS].insert_one(metrics)
        return str(result.inserted_id)
    
    async def get_latest_model_metrics(self) -> Optional[Dict]:
        """Récupérer les dernières métriques du modèle"""
        metrics = await self.database[settings.COLLECTION_MODEL_METRICS].find_one()
        if metrics:
            metrics["_id"] = str(metrics["_id"])
            if "saved_at" in metrics and isinstance(metrics["saved_at"], datetime):
                metrics["saved_at"] = metrics["saved_at"].isoformat()
        return metrics
    
    async def get_analytics_data(self) -> Dict[str, Any]:
        """Récupérer les données pour l'analytics"""
        total_predictions = await self.get_predictions_count()
        
        # Compter les churns
        churn_count = await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
            "prediction": 1
        })
        
        # Prédictions aujourd'hui
        today = datetime.now().date()
        start_of_day = datetime(today.year, today.month, today.day)
        predictions_today = await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
            "created_at": {"$gte": start_of_day}
        })
        
        # Clients à haut risque
        high_risk_count = await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
            "risk_level": "HIGH"
        })
        
        # Distribution horaire
        hourly_distribution = {}
        for hour in range(24):
            count = await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
                "created_at": {
                    "$gte": datetime(today.year, today.month, today.day, hour),
                    "$lt": datetime(today.year, today.month, today.day, hour + 1)
                }
            })
            hourly_distribution[str(hour)] = count
        
        # Confiance moyenne
        pipeline = [
            {"$group": {"_id": None, "avg_confidence": {"$avg": "$confidence"}}}
        ]
        result = await self.database[settings.COLLECTION_PREDICTIONS].aggregate(pipeline).to_list(length=1)
        avg_confidence = result[0]["avg_confidence"] if result else 0.85
        
        return {
            "total_predictions": total_predictions,
            "churn_rate": churn_count / total_predictions if total_predictions > 0 else 0,
            "avg_confidence": avg_confidence,
            "predictions_today": predictions_today,
            "high_risk_customers": high_risk_count,
            "hourly_distribution": hourly_distribution
        }

# Instance globale
mongodb = MongoDB()