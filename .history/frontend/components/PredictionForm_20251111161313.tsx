'use client';

import React, { useState } from 'react';
import { PredictionInput, PredictionResponse } from '../types/prediction';
import { predictChurn, healthCheck } from '@/lib/api';

const defaultFormData: PredictionInput = {
  account_length: 100,
  international_plan: 0,
  voice_mail_plan: 0,
  number_vmail_messages: 0,
  total_day_minutes: 200,
  total_day_calls: 100,
  total_day_charge: 30,
  total_eve_minutes: 200,
  total_eve_calls: 100,
  total_eve_charge: 15,
  total_night_minutes: 200,
  total_night_calls: 100,
  total_night_charge: 10,
  total_intl_minutes: 10,
  total_intl_calls: 5,
  total_intl_charge: 3,
  customer_service_calls: 2,
};

export default function PredictionForm() {
  const [formData, setFormData] = useState<PredictionInput>(defaultFormData);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'error'>('checking');

  // Vérifier la santé de l'API au chargement
  React.useEffect(() => {
    healthCheck()
      .then((health) => {
        setApiStatus('healthy');
      })
      .catch(() => setApiStatus('error'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await predictChurn(formData);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Erreur lors de la prédiction. Vérifiez que le serveur backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Statut de l'API */}
      <div className={`mb-6 p-4 rounded ${
        apiStatus === 'healthy' ? 'bg-green-100 border-green-300' : 
        apiStatus === 'error' ? 'bg-red-100 border-red-300' : 'bg-yellow-100 border-yellow-300'
      } border`}>
        <p className="font-semibold">
          {apiStatus === 'healthy' ? '✅ API Connectée' : 
           apiStatus === 'error' ? '❌ API Non disponible' : '🔍 Vérification de l\'API...'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Prédiction de Churn Client</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan International */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan International
              </label>
              <select
                name="international_plan"
                value={formData.international_plan}
                onChange={handleSelectChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Non</option>
                <option value={1}>Oui</option>
              </select>
            </div>

            {/* Plan Voicemail */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Voicemail
              </label>
              <select
                name="voice_mail_plan"
                value={formData.voice_mail_plan}
                onChange={handleSelectChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Non</option>
                <option value={1}>Oui</option>
              </select>
            </div>

            {/* Autres champs */}
            {Object.entries(formData)
              .filter(([key]) => !['international_plan', 'voice_mail_plan'].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading || apiStatus !== 'healthy'}
                className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-semibold text-lg"
              >
                {loading ? '🔮 Prédiction en cours...' : '📊 Prédire le Churn'}
              </button>
            </div>
          </form>
        </div>

        {/* Résultats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Résultats</h2>
          
          {prediction ? (
            <div className={`p-6 rounded-lg border-2 ${
              prediction.prediction === 1 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="text-center mb-4">
                <div className={`text-6xl mb-4 ${
                  prediction.prediction === 1 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {prediction.prediction === 1 ? '⚠️' : '✅'}
                </div>
                <h3 className={`text-2xl font-bold ${
                  prediction.prediction === 1 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {prediction.message}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Probabilité de Churn</label>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                    <div 
                      className={`h-4 rounded-full ${
                        prediction.prediction === 1 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${prediction.churn_probability * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-lg font-semibold mt-1">
                    {(prediction.churn_probability * 100).toFixed(2)}%
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Confiance</label>
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                    <div 
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-lg font-semibold mt-1">
                    {(prediction.confidence * 100).toFixed(2)}%
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Décision</p>
                    <p className={`text-lg font-bold ${
                      prediction.prediction === 1 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {prediction.prediction === 1 ? 'CHURN' : 'FIDÈLE'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Seuil</p>
                    <p className="text-lg font-bold text-purple-600">50%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg">Remplissez le formulaire pour obtenir une prédiction</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}