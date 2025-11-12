import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">ChurnPredict</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Stats</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-blue-300 text-sm">AI-Powered Churn Prediction Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Stop Customer
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Churn</span>
              Before It Happens
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge machine learning to predict customer churn with 87% accuracy. 
              Take proactive measures and transform your retention strategy with real-time insights.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link to="/predict">
                <Button size="lg" className="px-12 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25">
                  🚀 Start Predicting Free
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="secondary" size="lg" className="px-12 py-6 text-lg border-white/20 bg-white/5 hover:bg-white/10">
                  📺 Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trusted By */}
            <div className="mt-16">
              <p className="text-gray-400 mb-6">Trusted by innovative teams worldwide</p>
              <div className="flex justify-center items-center space-x-12 opacity-60">
                <div className="text-2xl font-bold text-gray-300">TechCorp</div>
                <div className="text-2xl font-bold text-gray-300">GlobalBank</div>
                <div className="text-2xl font-bold text-gray-300">InnovateLabs</div>
                <div className="text-2xl font-bold text-gray-300">DataSystems</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-blue-400">ChurnPredict</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform combines advanced AI with intuitive analytics to give you the edge in customer retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">AI-Powered Predictions</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced machine learning models with 87%+ accuracy rate, continuously learning from your data patterns.
              </p>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Real-Time Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                Live dashboards with actionable insights and automated alerts for at-risk customers.
              </p>
            </Card>

            <Card className="text-center p-8 bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Retention Automation</h3>
              <p className="text-gray-300 leading-relaxed">
                Automated retention campaigns and personalized interventions based on churn probability scores.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 shadow-2xl border border-slate-700">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="text-5xl font-bold text-blue-400 mb-3 group-hover:scale-110 transition-transform">87%</div>
                <div className="text-gray-300 font-semibold">Prediction Accuracy</div>
                <div className="text-sm text-gray-500 mt-2">Industry-leading precision</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-bold text-green-400 mb-3 group-hover:scale-110 transition-transform">14%</div>
                <div className="text-gray-300 font-semibold">Avg. Churn Reduction</div>
                <div className="text-sm text-gray-500 mt-2">Across all clients</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-bold text-purple-400 mb-3 group-hover:scale-110 transition-transform">1.2K+</div>
                <div className="text-gray-300 font-semibold">Customers Analyzed</div>
                <div className="text-sm text-gray-500 mt-2">Daily processing</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl font-bold text-orange-400 mb-3 group-hover:scale-110 transition-transform">95%</div>
                <div className="text-gray-300 font-semibold">Client Satisfaction</div>
                <div className="text-sm text-gray-500 mt-2">Based on reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Customer Retention?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using ChurnPredict to save millions in lost revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup">
              <Button size="lg" className="px-12 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="px-12 py-6 text-lg border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">ChurnPredict</span>
            </div>
            <div className="text-gray-400">
              © 2024 ChurnPredict. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};