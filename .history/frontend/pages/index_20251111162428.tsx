import PredictionForm from '@/components/PredictionForm'

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-900">
              🔮 Churn Prediction
            </h1>
            <p className="text-gray-600 mt-2">
              Prédisez la probabilité de départ de vos clients avec l'intelligence artificielle
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="py-8">
          <PredictionForm />
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-500">
            <p>© 2024 Churn Prediction App - Machine Learning & Next.js</p>
          </div>
        </footer>
      </main>
    </div>
  )
}