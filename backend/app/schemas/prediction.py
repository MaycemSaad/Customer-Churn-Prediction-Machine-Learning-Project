from pydantic import BaseModel
from typing import List

class FeatureImportance(BaseModel):
    feature: str
    importance: float

class ModelInfo(BaseModel):
    name: str
    version: str
    features: List[str]
    feature_importance: List[FeatureImportance]