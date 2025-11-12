import motor.motor_asyncio
from config import settings
from datetime import datetime, time
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
            
            # Créer des index pour optimiser les requêtes
            await self.database[settings.COLLECTION_PREDICTIONS].create_index("created_at")
            await self.database[settings.COLLECTION_PREDICTIONS].create_index("customer_id")
            await self.database[settings.COLLECTION_PREDICTIONS].create_index("risk_level")
            await self.database[settings.COLLECTION_CUSTOMERS].create_index("customer_id")
            
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
        try:
            prediction_data["created_at"] = datetime.now()
            result = await self.database[settings.COLLECTION_PREDICTIONS].insert_one(prediction_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"❌ Erreur sauvegarde prédiction: {e}")
            raise
    
    async def get_predictions(self, limit: int = 50, skip: int = 0) -> List[Dict]:
        """Récupérer les prédictions avec pagination"""
        try:
            cursor = self.database[settings.COLLECTION_PREDICTIONS].find().sort("created_at", -1).skip(skip).limit(limit)
            predictions = await cursor.to_list(length=limit)
            
            # Convertir ObjectId en string
            for pred in predictions:
                pred["_id"] = str(pred["_id"])
                if "created_at" in pred and isinstance(pred["created_at"], datetime):
                    pred["created_at"] = pred["created_at"].isoformat()
            
            return predictions
        except Exception as e:
            print(f"❌ Erreur récupération prédictions: {e}")
            return []
    
    async def get_predictions_count(self) -> int:
        """Compter le nombre total de prédictions"""
        try:
            return await self.database[settings.COLLECTION_PREDICTIONS].count_documents({})
        except Exception as e:
            print(f"❌ Erreur comptage prédictions: {e}")
            return 0
    
    async def get_predictions_today(self) -> int:
        """Compter les prédictions d'aujourd'hui"""
        try:
            today = datetime.now().date()
            start_of_day = datetime(today.year, today.month, today.day)
            end_of_day = datetime(today.year, today.month, today.day, 23, 59, 59)
            
            return await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
                "created_at": {"$gte": start_of_day, "$lte": end_of_day}
            })
        except Exception as e:
            print(f"❌ Erreur comptage prédictions aujourd'hui: {e}")
            return 0
    
    async def get_high_risk_count(self) -> int:
        """Compter les prédictions à haut risque"""
        try:
            return await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
                "risk_level": "HIGH"
            })
        except Exception as e:
            print(f"❌ Erreur comptage haut risque: {e}")
            return 0
    
    async def get_churn_count(self) -> int:
        """Compter les prédictions de churn"""
        try:
            return await self.database[settings.COLLECTION_PREDICTIONS].count_documents({
                "prediction": 1
            })
        except Exception as e:
            print(f"❌ Erreur comptage churn: {e}")
            return 0
    
    async def get_avg_confidence(self) -> float:
        """Calculer la confiance moyenne"""
        try:
            pipeline = [
                {"$group": {"_id": None, "avg_confidence": {"$avg": "$confidence"}}}
            ]
            result = await self.database[settings.COLLECTION_PREDICTIONS].aggregate(pipeline).to_list(length=1)
            return float(result[0]["avg_confidence"]) if result and result[0].get("avg_confidence") is not None else 0.85
        except Exception as e:
            print(f"❌ Erreur calcul confiance moyenne: {e}")
            return 0.85
    
    async def get_hourly_distribution(self) -> Dict[str, int]:
        """Récupérer la distribution horaire des prédictions d'aujourd'hui"""
        try:
            today = datetime.now().date()
            start_of_day = datetime(today.year, today.month, today.day)
            end_of_day = datetime(today.year, today.month, today.day, 23, 59, 59)
            
            # Pipeline d'agrégation pour grouper par heure
            pipeline = [
                {
                    "$match": {
                        "created_at": {
                            "$gte": start_of_day,
                            "$lte": end_of_day
                        }
                    }
                },
                {
                    "$project": {
                        "hour": {"$hour": "$created_at"}
                    }
                },
                {
                    "$group": {
                        "_id": "$hour",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            result = await self.database[settings.COLLECTION_PREDICTIONS].aggregate(pipeline).to_list(length=24)
            
            # Initialiser toutes les heures à 0
            distribution = {str(i): 0 for i in range(24)}
            
            # Remplir avec les données réelles
            for item in result:
                hour_str = str(item["_id"])
                if hour_str in distribution:
                    distribution[hour_str] = item["count"]
            
            return distribution
            
        except Exception as e:
            print(f"❌ Erreur distribution horaire: {e}")
            return {str(i): 0 for i in range(24)}
    
    async def save_customer(self, customer_data: Dict[str, Any]) -> str:
        """Sauvegarder un client"""
        try:
            customer_data["created_at"] = datetime.now()
            customer_data["updated_at"] = datetime.now()
            
            # Vérifier si le client existe déjà
            if customer_data.get("customer_id"):
                existing = await self.database[settings.COLLECTION_CUSTOMERS].find_one({
                    "customer_id": customer_data["customer_id"]
                })
                
                if existing:
                    # Mettre à jour
                    await self.database[settings.COLLECTION_CUSTOMERS].update_one(
                        {"_id": existing["_id"]},
                        {"$set": customer_data}
                    )
                    return str(existing["_id"])
            
            # Créer nouveau client
            result = await self.database[settings.COLLECTION_CUSTOMERS].insert_one(customer_data)
            return str(result.inserted_id)
            
        except Exception as e:
            print(f"❌ Erreur sauvegarde client: {e}")
            raise
    
    async def get_customers(self, limit: int = 50) -> List[Dict]:
        """Récupérer la liste des clients"""
        try:
            cursor = self.database[settings.COLLECTION_CUSTOMERS].find().sort("created_at", -1).limit(limit)
            customers = await cursor.to_list(length=limit)
            
            for customer in customers:
                customer["_id"] = str(customer["_id"])
                if "created_at" in customer and isinstance(customer["created_at"], datetime):
                    customer["created_at"] = customer["created_at"].isoformat()
            
            return customers
        except Exception as e:
            print(f"❌ Erreur récupération clients: {e}")
            return []
    
    async def save_model_metrics(self, metrics: Dict[str, Any]) -> str:
        """Sauvegarder les métriques du modèle"""
        try:
            metrics["saved_at"] = datetime.now()
            
            # Supprimer l'ancienne entrée et créer une nouvelle
            await self.database[settings.COLLECTION_MODEL_METRICS].delete_many({})
            result = await self.database[settings.COLLECTION_MODEL_METRICS].insert_one(metrics)
            return str(result.inserted_id)
        except Exception as e:
            print(f"❌ Erreur sauvegarde métriques: {e}")
            raise
    
    async def get_latest_model_metrics(self) -> Optional[Dict]:
        """Récupérer les dernières métriques du modèle"""
        try:
            metrics = await self.database[settings.COLLECTION_MODEL_METRICS].find_one()
            if metrics:
                metrics["_id"] = str(metrics["_id"])
                if "saved_at" in metrics and isinstance(metrics["saved_at"], datetime):
                    metrics["saved_at"] = metrics["saved_at"].isoformat()
            return metrics
        except Exception as e:
            print(f"❌ Erreur récupération métriques: {e}")
            return None

    # Méthodes supplémentaires pour la compatibilité
    async def get_predictions_by_date(self, date: datetime) -> List[Dict]:
        """Récupérer les prédictions d'une date spécifique"""
        try:
            start_of_day = datetime(date.year, date.month, date.day)
            end_of_day = datetime(date.year, date.month, date.day, 23, 59, 59)
            
            cursor = self.database[settings.COLLECTION_PREDICTIONS].find({
                "created_at": {"$gte": start_of_day, "$lte": end_of_day}
            })
            predictions = await cursor.to_list(length=1000)
            
            for pred in predictions:
                pred["_id"] = str(pred["_id"])
                if "created_at" in pred and isinstance(pred["created_at"], datetime):
                    pred["created_at"] = pred["created_at"].isoformat()
            
            return predictions
        except Exception as e:
            print(f"❌ Erreur récupération prédictions par date: {e}")
            return []

    async def get_high_risk_predictions(self) -> List[Dict]:
        """Récupérer les prédictions à haut risque"""
        try:
            cursor = self.database[settings.COLLECTION_PREDICTIONS].find({
                "risk_level": "HIGH"
            }).sort("created_at", -1)
            predictions = await cursor.to_list(length=100)
            
            for pred in predictions:
                pred["_id"] = str(pred["_id"])
                if "created_at" in pred and isinstance(pred["created_at"], datetime):
                    pred["created_at"] = pred["created_at"].isoformat()
            
            return predictions
        except Exception as e:
            print(f"❌ Erreur récupération prédictions haut risque: {e}")
            return []

    async def get_analytics_data(self) -> Dict[str, Any]:
        """Récupérer les données pour l'analytics (méthode de compatibilité)"""
        try:
            total_predictions = await self.get_predictions_count()
            churn_count = await self.get_churn_count()
            predictions_today = await self.get_predictions_today()
            high_risk_count = await self.get_high_risk_count()
            avg_confidence = await self.get_avg_confidence()
            hourly_distribution = await self.get_hourly_distribution()
            
            churn_rate = churn_count / total_predictions if total_predictions > 0 else 0
            
            return {
                "total_predictions": total_predictions,
                "churn_rate": churn_rate,
                "avg_confidence": avg_confidence,
                "predictions_today": predictions_today,
                "high_risk_customers": high_risk_count,
                "hourly_distribution": hourly_distribution
            }
        except Exception as e:
            print(f"❌ Erreur récupération données analytics: {e}")
            return {
                "total_predictions": 0,
                "churn_rate": 0.0,
                "avg_confidence": 0.85,
                "predictions_today": 0,
                "high_risk_customers": 0,
                "hourly_distribution": {str(i): 0 for i in range(24)}
            }

# Instance globale
mongodb = MongoDB()