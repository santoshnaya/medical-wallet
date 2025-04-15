'use client';

import { useState } from 'react';
import { DropletIcon } from 'lucide-react';

export default function AnemiaPrediction() {
  const [formData, setFormData] = useState({
    gender: '1',
    hemoglobin: '',
    mch: '',
    mchc: '',
    mcv: ''
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/anemia-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hemoglobin: Number(formData.hemoglobin),
          mch: Number(formData.mch),
          mchc: Number(formData.mchc),
          mcv: Number(formData.mcv)
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || 'Failed to get prediction');
      }
    } catch {
      setError('Failed to connect to prediction service');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
        <DropletIcon className="h-8 w-8 text-red-500 mr-2" />
        Anemia Risk Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hemoglobin (g/dL)</label>
            <input
              type="number"
              step="0.1"
              name="hemoglobin"
              value={formData.hemoglobin}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MCH (pg)</label>
            <input
              type="number"
              step="0.1"
              name="mch"
              value={formData.mch}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MCHC (g/dL)</label>
            <input
              type="number"
              step="0.1"
              name="mchc"
              value={formData.mchc}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MCV (fL)</label>
            <input
              type="number"
              step="0.1"
              name="mcv"
              value={formData.mcv}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Calculating...' : 'Calculate Risk'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {prediction !== null && !error && (
        <div className={`mt-6 p-4 rounded-md ${prediction > 0.5 ? 'bg-red-50' : 'bg-green-50'}`}>
          <h3 className="text-lg font-medium mb-2 text-black">
            Risk Assessment: {(prediction * 100).toFixed(1)}%
          </h3>
          <p className={prediction > 0.5 ? 'text-red-700' : 'text-green-700'}>
            {prediction > 0.5
              ? 'High risk of anemia. Please consult a healthcare professional.'
              : 'Lower risk of anemia. Continue maintaining a healthy lifestyle.'}
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Confidence: {((1 - Math.abs(prediction - 0.5) * 2) * 100).toFixed(1)}%</p>
            <p className="mt-1">Based on analysis of similar cases in the Anemia Dataset</p>
            <p className="mt-1">This prediction is based on comparing your blood parameters with known cases</p>
          </div>
        </div>
      )}
    </div>
  );
} 