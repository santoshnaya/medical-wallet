'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface BloodPressurePredictionProps {
  onClose: () => void;
}

const BloodPressurePrediction = ({ onClose }: BloodPressurePredictionProps) => {
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    gender: 'male',
    smoking: 'no',
    alcohol: 'no',
    physicalActivity: 'low',
    stressLevel: 'low',
    familyHistory: 'no',
    saltIntake: 'low',
    sleepHours: '7',
  });

  const [prediction, setPrediction] = useState<{
    prediction: string;
    riskLevel: string;
    confidence: number;
    matches: number;
    dataset: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.age || !formData.bmi) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/blood-pressure-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze blood pressure risk');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error in blood pressure prediction:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing the data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800">
          <h2 className="text-xl font-bold text-white">Blood Pressure Risk Assessment</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                    <input
                      type="number"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                    <input
                      type="number"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
                    <select
                      name="smoking"
                      value={formData.smoking}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol</label>
                    <select
                      name="alcohol"
                      value={formData.alcohol}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Activity</label>
                    <select
                      name="physicalActivity"
                      value={formData.physicalActivity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level</label>
                    <select
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family History</label>
                    <select
                      name="familyHistory"
                      value={formData.familyHistory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salt Intake</label>
                    <select
                      name="saltIntake"
                      value={formData.saltIntake}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze Risk'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Results</h3>
              {error ? (
                <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Blood Pressure Status</div>
                      <div className="text-lg font-semibold text-gray-900">{prediction.prediction}</div>
                    </div>
                    <div className={`bg-gradient-to-br rounded-lg p-4 ${
                      prediction.riskLevel === 'High' ? 'from-red-50 to-red-100' :
                      prediction.riskLevel === 'Moderate' ? 'from-yellow-50 to-yellow-100' :
                      'from-green-50 to-green-100'
                    }`}>
                      <div className="text-sm font-medium text-gray-500 mb-1">Risk Level</div>
                      <div className={`text-lg font-semibold ${
                        prediction.riskLevel === 'High' ? 'text-red-700' :
                        prediction.riskLevel === 'Moderate' ? 'text-yellow-700' :
                        'text-green-700'
                      }`}>
                        {prediction.riskLevel}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Confidence</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Similar Cases</div>
                      <div className="text-lg font-semibold text-gray-900">{prediction.matches}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Dataset</div>
                      <div className="text-lg font-semibold text-gray-900">{prediction.dataset}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-8">
                  <p className="text-center text-gray-500">
                    Fill in the patient information and click "Analyze Risk" to get the assessment results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodPressurePrediction; 