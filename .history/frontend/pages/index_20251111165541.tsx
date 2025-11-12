import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Premium */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-xl">
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  ChurnPredict AI
                </h1>
                <p className="text-cyan-300/80 text-sm">Intelligence Artificielle Avancée</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/prediction" className="text-cyan-200/80 hover:text-cyan-100 transition-colors duration-200 text-sm font-medium">
                🚀 Commencer l'analyse
              </Link>
              <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25">
                Premium
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 text-sm">Système IA Actif & Surveillé</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Prédiction Intelligente
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                du Churn Client
              </span>
            </h1>
            
            <p className="text-xl text-cyan-200/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Détectez les risques de départ de vos clients avec notre intelligence artificielle avancée. 
              Analyse prédictive en temps réel avec une précision de 95%.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center space-x-6 mb-12">
              <Link 
                href="/prediction" 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 font-semibold text-lg"
              >
                🚀 Analyser Maintenant
              </Link>
              <button className="border border-cyan-500/50 text-cyan-300 px-8 py-4 rounded-xl hover:bg-cyan-500/10 transition-all duration-200 font-semibold text-lg">
                📊 Voir la Démo
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-12 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-cyan-300/70 text-sm">Précision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">2.5s</div>
                <div className="text-cyan-300/70 text-sm">Analyse</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-cyan-300/70 text-sm">Surveillance</div>
              </div>
            </div>
          </div>

          {/* Preview du Formulaire */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Interface d'Analyse Avancée</h3>
              <p className="text-cyan-200/70">Formulaire intuitif pour une prédiction précise</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <div className="h-2 bg-white/20 rounded-full flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link 
                href="/prediction" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
              >
                <span>Accéder au Formulaire Complet</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pourquoi Choisir Notre Solution ?
            </h2>
            <p className="text-cyan-200/80 text-lg max-w-2xl mx-auto">
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
              <div key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-cyan-500/30">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-cyan-200/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Premium */}
      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-lg">
                <span className="text-xl">🔮</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">ChurnPredict AI</h3>
                <p className="text-cyan-300/70 text-sm">Intelligence Artificielle pour Business</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <div className="text-center">
                <div className="text-white font-semibold">Solutions</div>
                <div className="text-cyan-300/70 text-sm space-y-1 mt-2">
                  <div>Prédiction Churn</div>
                  <div>Analytics Avancés</div>
                  <div>API Entreprise</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">Entreprise</div>
                <div className="text-cyan-300/70 text-sm space-y-1 mt-2">
                  <div>À propos</div>
                  <div>Carrières</div>
                  <div>Contact</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">Support</div>
                <div className="text-cyan-300/70 text-sm space-y-1 mt-2">
                  <div>Documentation</div>
                  <div>Centre d'aide</div>
                  <div>Status</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 rounded-2xl p-6">
                <div className="text-white font-bold mb-2">🚀 Prêt à commencer ?</div>
                <Link 
                  href="/prediction"
                  className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-cyan-500/25"
                >
                  Essai Gratuit
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-cyan-300/60">
              © 2024 ChurnPredict AI. Tous droits réservés. | 
              <span className="text-green-400 ml-2">Système Opérationnel</span>
            </p>
            <p className="text-cyan-300/40 text-sm mt-2">
              Propulsé par Next.js, TensorFlow & Intelligence Artificielle Avancée
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}