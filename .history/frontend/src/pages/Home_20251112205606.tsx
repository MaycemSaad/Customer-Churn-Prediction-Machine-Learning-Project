import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import './Home.css';

export const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState({
    accuracy: 0,
    churnRate: 0,
    customers: 0,
    satisfaction: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elementsToObserve = [statsRef.current, featuresRef.current, ctaRef.current].filter(Boolean);
    elementsToObserve.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Animation des statistiques
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        accuracy: 92,
        churnRate: 14,
        customers: 1250,
        satisfaction: 95
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden home-container">
      {/* Éléments d'arrière-plan animés améliorés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse-slower"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Section Hero améliorée */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Badge de précision */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 shadow-sm mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              <span className="text-green-600">92% de précision</span> 
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Prédiction du
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mt-2">
              Churn Client
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Solution IA avancée pour le <span className="font-semibold text-blue-600">secteur des télécommunications</span>. 
            Anticipez le départ de vos clients avec <span className="font-semibold text-purple-600">92% de précision</span> et 
            agissez <span className="font-semibold text-cyan-600">proactivement</span> pour les retenir.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/predict" className="group">
              <Button size="lg" className="px-10 py-5 text-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                <span className="flex items-center gap-3">
                  🚀 Démarrer la Prédiction
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link to="/dashboard" className="group">
              <Button variant="secondary" size="lg" className="px-10 py-5 text-lg font-semibold transform transition-all duration-300 hover:scale-105 border-2 border-gray-300 bg-white/80 backdrop-blur-sm">
                <span className="flex items-center gap-3">
                  📊 Voir le Dashboard
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>

          {/* Indicateur de scroll amélioré */}
          <div className="animate-bounce">
            <div className="w-8 h-12 border-3 border-blue-400 rounded-full flex justify-center">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full mt-3 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Section Fonctionnalités avec focus télécom */}
        <div 
          ref={featuresRef}
          className="features-grid grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 opacity-0 translate-y-10 transition-all duration-700 delay-300"
        >
          {[
            {
              icon: "📡",
              title: "Analytics Télécom",
              description: "Modèle ML spécialisé télécom avec 92% de précision pour détecter les clients à risque en temps réel.",
              color: "blue",
              bgColor: "bg-blue-100",
              metrics: ["Temps d'engagement", "Usage données", "Historique paiements"]
            },
            {
              icon: "🤖",
              title: "IA Prédictive",
              description: "Algorithmes avancés analysant le comportement client pour anticiper le churn 30 jours à l'avance.",
              color: "green",
              bgColor: "bg-green-100",
              metrics: ["Alertes précoces", "Scores de risque", "Recommandations"]
            },
            {
              icon: "💬",
              title: "Stratégies de Rétention",
              description: "Plans d'action personnalisés basés sur l'analyse prédictive pour réduire le churn de 40%.",
              color: "purple",
              bgColor: "bg-purple-100",
              metrics: ["Offres ciblées", "Support proactif", "Campagnes personnalisées"]
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="feature-item opacity-0 translate-y-10 transition-all duration-700"
              style={{ transitionDelay: `${500 + index * 200}ms` }}
            >
              <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-200/60 group cursor-pointer h-full bg-white/70 backdrop-blur-sm">
                <div className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors mb-6">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <div className={`w-1.5 h-1.5 bg-${feature.color}-400 rounded-full`}></div>
                      {metric}
                    </div>
                  ))}
                </div>
                <div className={`mt-6 w-12 h-1.5 bg-${feature.color}-500 rounded-full mx-auto group-hover:w-20 transition-all duration-300`}></div>
              </Card>
            </div>
          ))}
        </div>

        {/* Section Statistiques améliorée */}
        <div 
          ref={statsRef}
          className="stats-section bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/40 opacity-0 translate-y-10 transition-all duration-700 delay-700 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Impact Mesurable</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des résultats concrets pour les opérateurs télécoms grâce à notre solution d'IA prédictive
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                value: animatedStats.accuracy, 
                suffix: "%", 
                label: "Précision du Modèle", 
                color: "text-green-600",
                icon: "🎯",
                description: "Score de précision validé"
              },
              { 
                value: animatedStats.churnRate, 
                suffix: "%", 
                label: "Taux de Churn Réduit", 
                color: "text-blue-600",
                icon: "📉",
                description: "Réduction moyenne constatée"
              },
              { 
                value: animatedStats.customers, 
                suffix: "+", 
                label: "Clients Analysés", 
                color: "text-purple-600",
                icon: "👥",
                description: "Base clients traitée"
              },
              { 
                value: animatedStats.satisfaction, 
                suffix: "%", 
                label: "Satisfaction Client", 
                color: "text-orange-600",
                icon: "⭐",
                description: "Taux de rétention amélioré"
              }
            ].map((stat, index) => (
              <div key={index} className="text-center group p-6 rounded-2xl hover:bg-gray-50/50 transition-all duration-300">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className={`text-5xl font-bold ${stat.color} mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section CTA améliorée */}
        <div 
          ref={ctaRef}
          className="cta-section text-center opacity-0 translate-y-10 transition-all duration-700 delay-1000"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
              Prêt à Révolutionner Votre Stratégie Client ?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed relative z-10">
              Rejoignez les opérateurs télécoms qui réduisent leur churn de 40% grâce à notre plateforme IA. 
              <span className="block font-semibold text-white mt-2">Démo gratuite disponible.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/predict">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg font-bold transform transition-all duration-300 hover:scale-105 shadow-lg">
                  🚀 Commencer Maintenant
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-12 py-6 text-lg font-bold transform transition-all duration-300 hover:scale-105">
                  📞 Demander une Démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};