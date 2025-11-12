import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { apiService } from '../services/api'
import { CustomerData } from '../types'

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await apiService.getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const getRiskLevel = (customer: CustomerData) => {
    // Simple risk calculation based on service calls and account length
    const riskScore = customer.customer_service_calls * 20 + (200 - customer.account_length) / 10
    if (riskScore > 60) return 'high'
    if (riskScore > 30) return 'medium'
    return 'low'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage and analyze your customer base</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <div className="lg:col-span-2">
            <Card title="Customer List">
              <div className="space-y-4">
                {customers.map((customer) => {
                  const riskLevel = getRiskLevel(customer)
                  return (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {customer.name?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {customer.name || `Customer ${customer.id}`}
                          </h4>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(riskLevel)}`}>
                          {riskLevel.toUpperCase()} RISK
                        </span>
                        <Button variant="secondary" size="sm">
                          Analyze
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Customer Details */}
          <div>
            <Card title="Customer Details">
              {selectedCustomer ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xl">
                        {selectedCustomer.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {selectedCustomer.name || `Customer ${selectedCustomer.id}`}
                      </h4>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      <p className="text-gray-600">{selectedCustomer.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedCustomer.account_length}
                      </div>
                      <div className="text-sm text-gray-600">Account Days</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedCustomer.total_day_minutes}
                      </div>
                      <div className="text-sm text-gray-600">Day Minutes</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Calls</span>
                      <span className="font-semibold">{selectedCustomer.customer_service_calls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">International Plan</span>
                      <span className="font-semibold">
                        {selectedCustomer.international_plan ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voice Mail Plan</span>
                      <span className="font-semibold">
                        {selectedCustomer.voice_mail_plan ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full">
                    Run Churn Prediction
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a customer to view details
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}