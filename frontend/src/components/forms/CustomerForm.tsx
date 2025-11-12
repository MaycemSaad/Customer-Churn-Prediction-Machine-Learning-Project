import React from 'react';
import { CustomerData, PredictionInput } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CustomerFormProps {
  onSubmit: (data: PredictionInput) => void; // Changé pour PredictionInput
  loading?: boolean;
  initialData?: Partial<CustomerData>;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
}) => {
  const [formData, setFormData] = React.useState<CustomerData>({
    account_length: initialData?.account_length || 100,
    international_plan: initialData?.international_plan || 0,
    voice_mail_plan: initialData?.voice_mail_plan || 0,
    number_vmail_messages: initialData?.number_vmail_messages || 0,
    total_day_minutes: initialData?.total_day_minutes || 200,
    total_day_calls: initialData?.total_day_calls || 100,
    total_day_charge: initialData?.total_day_charge || 30,
    total_eve_minutes: initialData?.total_eve_minutes || 200,
    total_eve_calls: initialData?.total_eve_calls || 100,
    total_eve_charge: initialData?.total_eve_charge || 15,
    total_night_minutes: initialData?.total_night_minutes || 200,
    total_night_calls: initialData?.total_night_calls || 100,
    total_night_charge: initialData?.total_night_charge || 10,
    total_intl_minutes: initialData?.total_intl_minutes || 10,
    total_intl_calls: initialData?.total_intl_calls || 5,
    total_intl_charge: initialData?.total_intl_charge || 3,
    customer_service_calls: initialData?.customer_service_calls || 2,
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TRANSFORMATION CRITIQUE: Convertir CustomerData en PredictionInput
    const predictionInput: PredictionInput = {
      // Champs obligatoires pour l'API
      customer_name: formData.name || 'Customer', // Utiliser le nom comme customer_name
      customer_id: `CUST_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      
      // Données de prédiction
      account_length: formData.account_length,
      international_plan: formData.international_plan,
      voice_mail_plan: formData.voice_mail_plan,
      number_vmail_messages: formData.number_vmail_messages,
      total_day_minutes: formData.total_day_minutes,
      total_day_calls: formData.total_day_calls,
      total_day_charge: formData.total_day_charge,
      total_eve_minutes: formData.total_eve_minutes,
      total_eve_calls: formData.total_eve_calls,
      total_eve_charge: formData.total_eve_charge,
      total_night_minutes: formData.total_night_minutes,
      total_night_calls: formData.total_night_calls,
      total_night_charge: formData.total_night_charge,
      total_intl_minutes: formData.total_intl_minutes,
      total_intl_calls: formData.total_intl_calls,
      total_intl_charge: formData.total_intl_charge,
      customer_service_calls: formData.customer_service_calls,
    };

    console.log('🔍 Données envoyées à l\'API:', predictionInput);
    onSubmit(predictionInput);
  };

  const handleChange = (field: keyof CustomerData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email address"
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
          <Input
            label="Account Length (days)"
            type="number"
            value={formData.account_length}
            onChange={(e) => handleChange('account_length', parseFloat(e.target.value))}
            min="1"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                International Plan
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.international_plan}
                onChange={(e) => handleChange('international_plan', parseInt(e.target.value))}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Mail Plan
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.voice_mail_plan}
                onChange={(e) => handleChange('voice_mail_plan', parseInt(e.target.value))}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Usage Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Day Minutes"
            type="number"
            step="0.1"
            value={formData.total_day_minutes}
            onChange={(e) => handleChange('total_day_minutes', parseFloat(e.target.value))}
            min="0"
            required
          />
          <Input
            label="Day Calls"
            type="number"
            value={formData.total_day_calls}
            onChange={(e) => handleChange('total_day_calls', parseFloat(e.target.value))}
            min="0"
            required
          />
          <Input
            label="Day Charge"
            type="number"
            step="0.1"
            value={formData.total_day_charge}
            onChange={(e) => handleChange('total_day_charge', parseFloat(e.target.value))}
            min="0"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Evening Minutes"
            type="number"
            step="0.1"
            value={formData.total_eve_minutes}
            onChange={(e) => handleChange('total_eve_minutes', parseFloat(e.target.value))}
            min="0"
            required
          />
          <Input
            label="Evening Calls"
            type="number"
            value={formData.total_eve_calls}
            onChange={(e) => handleChange('total_eve_calls', parseFloat(e.target.value))}
            min="0"
            required
          />
          <Input
            label="Evening Charge"
            type="number"
            step="0.1"
            value={formData.total_eve_charge}
            onChange={(e) => handleChange('total_eve_charge', parseFloat(e.target.value))}
            min="0"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Customer Service Calls"
            type="number"
            value={formData.customer_service_calls}
            onChange={(e) => handleChange('customer_service_calls', parseFloat(e.target.value))}
            min="0"
            max="20"
            required
          />
          <Input
            label="International Minutes"
            type="number"
            step="0.1"
            value={formData.total_intl_minutes}
            onChange={(e) => handleChange('total_intl_minutes', parseFloat(e.target.value))}
            min="0"
            required
          />
          <Input
            label="International Calls"
            type="number"
            value={formData.total_intl_calls}
            onChange={(e) => handleChange('total_intl_calls', parseFloat(e.target.value))}
            min="0"
            required
          />
        </div>
      </div>

      <Button type="submit" loading={loading} className="w-full py-3 text-lg">
        Analyze Customer Churn
      </Button>
    </form>
  );
};