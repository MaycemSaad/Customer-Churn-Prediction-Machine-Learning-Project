import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section with enhanced animations */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold animate-bounce-subtle">
              🤖 AI-Powered Analytics
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Customer Churn
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prediction
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Leverage <span className="font-semibold text-blue-600">AI-powered analytics</span> to predict customer churn 
            and take <span className="font-semibold text-purple-600">proactive measures</span> to retain your valuable customers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/predict" className="group">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-blue-200">
                <span className="flex items-center gap-2">
                  Start Predicting
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link to="/dashboard" className="group">
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg font-semibold transform transition-all duration-300 hover:scale-105 border-2">
                <span className="flex items-center gap-2">
                  View Dashboard
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Features Grid with staggered animation */}
        <div 
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 opacity-0 translate-y-10 transition-all duration-700 delay-300"
        >
          {[
            {
              icon: "📊",
              title: "Advanced Analytics",
              description: "Real-time churn prediction using machine learning models with 87%+ accuracy.",
              color: "blue"
            },
            {
              icon: "🔮",
              title: "Smart Predictions",
              description: "Get instant churn probability scores and actionable insights for each customer.",
              color: "green"
            },
            {
              icon: "💡",
              title: "Data-Driven Decisions",
              description: "Make informed retention decisions based on comprehensive customer analytics.",
              color: "purple"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="opacity-0 translate-y-10 transition-all duration-700"
              style={{ transitionDelay: `${500 + index * 200}ms` }}
            >
              <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group cursor-pointer">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
                <div className={`mt-6 w-12 h-1 bg-${feature.color}-500 rounded-full mx-auto group-hover:w-20 transition-all duration-300`}></div>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Section with counter animation */}
        <div 
          ref={statsRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 opacity-0 translate-y-10 transition-all duration-700 delay-700"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 87, suffix: "%", label: "Prediction Accuracy", color: "text-blue-600" },
              { value: 14, suffix: "%", label: "Avg. Churn Rate", color: "text-green-600" },
              { value: 1.2, suffix: "K", label: "Customers Analyzed", color: "text-purple-600" },
              { value: 95, suffix: "%", label: "Client Satisfaction", color: "text-orange-600" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-4xl font-bold ${stat.color} mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 opacity-0 translate-y-10 transition-all duration-700 delay-1000">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Reduce Customer Churn?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Start predicting customer behavior today and transform your retention strategy with our AI-powered platform.
            </p>
            <Link to="/predict">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold transform transition-all duration-300 hover:scale-105">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 15s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

// Component for animated counters
const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${value}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span id={`counter-${value}`}>
      {count}{suffix}
    </span>
  );
};