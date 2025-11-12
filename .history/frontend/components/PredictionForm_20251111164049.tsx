'use client';

import React, { useState, useEffect } from 'react';
import { PredictionInput, PredictionResponse } from '@/types/prediction';
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

// Groupes de champs pour une meilleure organisation
const fieldGroups = {
  informations_client: [
    'account_length',
    'international_plan', 
    'voice_mail_plan',
    'number_vmail_messages',
    'customer_service_calls'
  ],
  appels_jour: [
    'total_day_minutes',
    'total_day_calls', 
    'total_day_charge'
  ],
  appels_soir: [
    'total_eve_minutes',
    'total_eve_calls',
    'total_eve_charge'
  ],
  appels_nuit: [
    'total_night_minutes',
    'total_night_calls',
    'total_night_charge'
  ],
  appels_internationaux: [
    'total_intl_minutes',
    'total_intl_calls',
    'total_intl_charge'
  ]
};

const groupLabels = {
  informations_client: '📋 Informations Client',
  appels_jour: '☀️ Appels de Jour',
  appels_soir: '🌙 Appels de Soir',
  appels_nuit: '🌃 Appels de Nuit',
  appels_internationaux: '🌍 Appels Internationaux'
};

const fieldLabels: { [key: string]: string } = {
  account_length: 'Durée du Compte (jours)',
  international_plan: 'Plan International',
  voice_mail_plan: 'Plan Voicemail',
  number_vmail_messages: 'Messages Voicemail',
  customer_service_calls: 'Appels Service Client',
  total_day_minutes: 'Minutes Jour',
  total_day_calls: 'Appels Jour',
  total_day_charge: 'Coût Jour (€)',
  total_eve_minutes: 'Minutes Soir',
  total_eve_calls: 'Appels Soir',
  total_eve_charge: 'Coût Soir (€)',
  total_night_minutes: 'Minutes Nuit',
  total_night_calls: 'Appels Nuit',
  total_night_charge: 'Coût Nuit (€)',
  total_intl_minutes: 'Minutes International',
  total_intl_calls: 'Appels International',
  total_intl_charge: 'Coût International (€)'
};

export default function PredictionForm() {
  const [formData, setFormData] = useState<PredictionInput>(defaultFormData);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [activeTab, setActiveTab] = useState('informations_client');

  // Vérifier la santé de l'API au chargement
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthCheck();
        setApiStatus('healthy');
      } catch (error) {
        console.error('Health check failed:', error);
        setApiStatus('error');
      }
    };

    checkHealth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await predictChurn(formData);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Erreur lors de la prédiction. Vérifiez que le serveur backend est démarré sur http://localhost:8000');
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

  const getRiskLevel = (probability: number) => {
    if (probability < 0.3) return { level: 'Faible', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' };
    if (probability < 0.6) return { level: 'Moyen', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Élevé', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const riskInfo = prediction ? getRiskLevel(prediction.churn_probability) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header amélioré */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Churn Prediction
                </h1>
                <p className="text-gray-600 text-sm">Prédiction intelligente de départ des clients avec IA</p>
              </div>
            </div>
            
            {/* Statut API */}
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              apiStatus === 'healthy' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : apiStatus === 'error' 
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              {apiStatus === 'healthy' ? '✅ API Connectée' : 
               apiStatus === 'error' ? '❌ API Hors ligne' : '🔄 Connexion...'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Formulaire - 2 colonnes */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">📊 Analyse Client</h2>
                  <div className="text-sm text-gray-500">
                    Remplissez les informations pour analyser le risque de churn
                  </div>
                </div>

                {/* Navigation par onglets */}
                <div className="flex space-x-1 mb-8 p-1 bg-gray-100 rounded-2xl">
                  {Object.entries(groupLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeTab === key
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {Object.entries(fieldGroups).map(([groupKey, fields]) => (
                      <div
                        key={groupKey}
                        className={`space-y-4 transition-all duration-300 ${
                          activeTab === groupKey ? 'block' : 'hidden'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {fields.map((field) => (
                            <div key={field} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                {fieldLabels[field]}
                              </label>
                              
                              {field.includes('_plan') ? (
                                <select
                                  name={field}
                                  value={formData[field as keyof PredictionInput] as number}
                                  onChange={handleSelectChange}
                                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                                >
                                  <option value={0}>Non</option>
                                  <option value={1}>Oui</option>
                                </select>
                              ) : (
                                <input
                                  type="number"
                                  name={field}
                                  value={formData[field as keyof PredictionInput] as number}
                                  onChange={handleInputChange}
                                  step="any"
                                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                                  placeholder={`Entrez ${fieldLabels[field].toLowerCase()}`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading || apiStatus !== 'healthy'}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyse en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>🎯</span>
                          <span>Analyser le Risque de Churn</span>
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Résultats - 1 colonne */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Résultats</h2>
                
                {prediction ? (
                  <div className="space-y-6">
                    {/* Carte de statut principale */}
                    <div className={`p-6 rounded-2xl border-2 ${riskInfo?.bg} ${riskInfo?.border} transition-all duration-300`}>
                      <div className="text-center mb-4">
                        <div className={`text-5xl mb-4 ${riskInfo?.color}`}>
                          {prediction.prediction === 1 ? '⚠️' : '✅'}
                        </div>
                        <h3 className={`text-xl font-bold ${riskInfo?.color} mb-2`}>
                          {prediction.message}
                        </h3>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskInfo?.color.replace('text-', 'bg-').replace('-500', '-100')} ${riskInfo?.color}`}>
                          Niveau de risque: {riskInfo?.level}
                        </div>
                      </div>

                      {/* Jauges améliorées */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Probabilité de Churn</span>
                            <span className="font-semibold">{(prediction.churn_probability * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                                prediction.churn_probability < 0.3 ? 'bg-green-500' :
                                prediction.churn_probability < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${prediction.churn_probability * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Confiance de l'IA</span>
                            <span className="font-semibold">{(prediction.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${prediction.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cartes de métriques */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600 text-center">
                          {prediction.prediction === 1 ? 'CHURN' : 'FIDÈLE'}
                        </div>
                        <div className="text-xs text-blue-600 text-center mt-1">Décision</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600 text-center">50%</div>
                        <div className="text-xs text-purple-600 text-center mt-1">Seuil</div>
                      </div>
                    </div>

                    {/* Recommandations */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">💡 Recommandations</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        {prediction.churn_probability > 0.6 ? (
                          <>
                            <div>• Offre promotionnelle ciblée</div>
                            <div>• Contact du service client</div>
                            <div>• Analyse des feedbacks</div>
                          </>
                        ) : prediction.churn_probability > 0.3 ? (
                          <>
                            <div>• Surveillance active</div>
                            <div>• Communication régulière</div>
                            <div>• Enquête de satisfaction</div>
                          </>
                        ) : (
                          <>
                            <div>• Maintenance de la relation</div>
                            <div>• Programmes de fidélité</div>
                            <div>• Suivi standard</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 text-gray-300">📊</div>
                    <p className="text-gray-500 text-lg">Remplissez le formulaire pour obtenir une analyse</p>
                    <p className="text-gray-400 text-sm mt-2">L'IA analysera le risque de départ du client</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer amélioré */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">© 2024 Churn Prediction - Intelligence Artificielle Avancée</p>
              <p className="text-gray-400 text-sm">Powered by Machine Learning & Next.js</p>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Système Opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}