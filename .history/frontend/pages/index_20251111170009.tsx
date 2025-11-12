import { useState, useEffect } from 'react';
import PredictionForm from '@/components/PredictionForm'

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Vérifier la préférence système
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'
    }`}>
      {/* Navigation Premium */}
      <nav className={`backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-300 ${
        darkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600'
              }`}>
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  darkMode 
                    ? 'from-white to-cyan-200' 
                    : 'from-gray-800 to-cyan-600'
                }`}>
                  ChurnPredict AI
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-cyan-300/80' : 'text-cyan-600/80'
                }`}>
                  Intelligence Artificielle Avancée
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className={`transition-colors duration-200 text-sm font-medium ${
                darkMode 
                  ? 'text-cyan-200/80 hover:text-cyan-100' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                📊 Dashboard
              </button>
              <button className={`transition-colors duration-200 text-sm font-medium ${
                darkMode 
                  ? 'text-cyan-200/80 hover:text-cyan-100' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}>
                📈 Analytics
              </button>
              
              {/* Toggle Theme */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              <button className={`text-white px-6 py-2 rounded-xl transition-all duration-200 shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 hover:shadow-cyan-500/25' 
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 hover:shadow-cyan-600/25'
              }`}>
                🚀 Premium
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        {darkMode && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center space-x-2 backdrop-blur-sm border px-4 py-2 rounded-full mb-6 transition-colors duration-300 ${
              darkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/80 border-gray-200'
            }`}>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`text-sm ${
                darkMode ? 'text-cyan-300' : 'text-green-600'
              }`}>
                Système IA Actif & Surveillé
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                darkMode 
                  ? 'from-white via-cyan-200 to-purple-200' 
                  : 'from-gray-900 via-cyan-700 to-purple-700'
              }`}>
                Prédiction Intelligente
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                du Churn Client
              </span>
            </h1>
            
            <p className={`text-xl max-w-3xl mx-auto mb-8 leading-relaxed ${
              darkMode ? 'text-cyan-200/80' : 'text-gray-600'
            }`}>
              Détectez les risques de départ de vos clients avec notre intelligence artificielle avancée. 
              Analyse prédictive en temps réel avec une précision de 95%.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-12 mb-12">
              {[
                { value: '95%', label: 'Précision' },
                { value: '2.5s', label: 'Analyse' },
                { value: '24/7', label: 'Surveillance' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-cyan-300/70' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className={`backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-300 ${
            darkMode 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className={`p-1 ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20' 
                : 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10'
            }`}>
              <div className={`rounded-2xl ${
                darkMode ? 'bg-slate-900' : 'bg-white'
              }`}>
                <PredictionForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`backdrop-blur-sm border-t transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-900/50 border-white/10' 
          : 'bg-gray-50/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Pourquoi Choisir Notre Solution ?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              darkMode ? 'text-cyan-200/80' : 'text-gray-600'
            }`}>
              Une plateforme complète d'analyse prédictive conçue pour les entreprises modernes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "IA Avancée",
                description: "Algorithmes de machine learning entraînés sur des millions de données clients"
              },
              {
                icon: "⚡",
                title: "Temps Réel",
                description: "Analyses en quelques secondes avec résultats instantanés"
              },
              {
                icon: "🛡️",
                title: "Sécurisé",
                description: "Données chiffrées et conformité RGPD garantie"
              },
              {
                icon: "📊",
                title: "Analytics",
                description: "Tableaux de bord détaillés et rapports personnalisés"
              },
              {
                icon: "🔍",
                title: "Précision",
                description: "Détection des patterns complexes avec haute précision"
              },
              {
                icon: "💼",
                title: "Enterprise",
                description: "Solution scalable pour entreprises de toutes tailles"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`group backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30' 
                    : 'bg-white border-gray-200 hover:bg-white hover:border-cyan-400/50 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  darkMode ? 'text-cyan-200/70' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Premium */}
      <footer className={`backdrop-blur-sm border-t transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 border-white/10' 
          : 'bg-gray-900/5 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600'
              }`}>
                <span className="text-xl">🔮</span>
              </div>
              <div>
                <h3 className={`font-bold text-lg ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ChurnPredict AI
                </h3>
                <p className={`text-sm ${
                  darkMode ? 'text-cyan-300/70' : 'text-gray-600'
                }`}>
                  Intelligence Artificielle pour Business
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              {[
                { title: "Solutions", items: ["Prédiction Churn", "Analytics Avancés", "API Entreprise"] },
                { title: "Entreprise", items: ["À propos", "Carrières", "Contact"] },
                { title: "Support", items: ["Documentation", "Centre d'aide", "Status"] }
              ].map((section, index) => (
                <div key={index} className="text-center">
                  <div className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </div>
                  <div className={`text-sm space-y-1 mt-2 ${
                    darkMode ? 'text-cyan-300/70' : 'text-gray-600'
                  }`}>
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className={`border rounded-2xl p-6 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-white/10' 
                  : 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-gray-200'
              }`}>
                <div className={`font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  🚀 Prêt à commencer ?
                </div>
                <button className={`text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 hover:shadow-cyan-500/25' 
                    : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 hover:shadow-cyan-600/25'
                }`}>
                  Essai Gratuit
                </button>
              </div>
            </div>
          </div>

          <div className={`border-t mt-12 pt-8 text-center transition-colors duration-300 ${
            darkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
            <p className={`${
              darkMode ? 'text-cyan-300/60' : 'text-gray-500'
            }`}>
              © 2024 ChurnPredict AI. Tous droits réservés. | 
              <span className="text-green-400 ml-2">Système Opérationnel</span>
            </p>
            <p className={`text-sm mt-2 ${
              darkMode ? 'text-cyan-300/40' : 'text-gray-400'
            }`}>
              Propulsé par Next.js, TensorFlow & Intelligence Artificielle Avancée
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}