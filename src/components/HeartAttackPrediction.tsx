'use client';

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function HeartAttackPrediction() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '1',
    chestPainType: '0',
    restingBP: '',
    cholesterol: '',
    fastingBS: '0',
    restingECG: '0',
    maxHR: '',
    exerciseAngina: '0',
    oldpeak: '0',
    stSlope: '0'
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/heart-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          restingBP: Number(formData.restingBP),
          cholesterol: Number(formData.cholesterol),
          maxHR: Number(formData.maxHR),
          oldpeak: Number(formData.oldpeak)
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
        <HeartIcon className="h-8 w-8 text-red-500 mr-2" />
        Heart Attack Risk Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
            <select
              name="chestPainType"
              value={formData.chestPainType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resting Blood Pressure</label>
            <input
              type="number"
              name="restingBP"
              value={formData.restingBP}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cholesterol</label>
            <input
              type="number"
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar</label>
            <select
              name="fastingBS"
              value={formData.fastingBS}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="0">≤ 120 mg/dl</option>
              <option value="1">&gt; 120 mg/dl</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resting ECG</label>
            <select
              name="restingECG"
              value={formData.restingECG}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">Left Ventricular Hypertrophy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Heart Rate</label>
            <input
              type="number"
              name="maxHR"
              value={formData.maxHR}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Exercise Induced Angina</label>
            <select
              name="exerciseAngina"
              value={formData.exerciseAngina}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ST Depression</label>
            <input
              type="number"
              step="0.1"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ST Slope</label>
            <select
              name="stSlope"
              value={formData.stSlope}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            >
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
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
              ? 'High risk of heart disease. Please consult a healthcare professional.'
              : 'Lower risk of heart disease. Continue maintaining a healthy lifestyle.'}
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Confidence: {((1 - Math.abs(prediction - 0.5) * 2) * 100).toFixed(1)}%</p>
            <p className="mt-1">Based on analysis of similar cases in the Cleveland Heart Disease Dataset</p>
            <p className="mt-1">This prediction is based on comparing your data with 10 most similar cases from the dataset</p>
          </div>
        </div>
      )}
    </div>
  );
} 