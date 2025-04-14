'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, AlertCircle, Info } from 'lucide-react'

interface DiseaseInfo {
  name: string
  description: string
  treatment: string[]
  prevention: string[]
}

const diseaseInfo: Record<string, DiseaseInfo> = {
  'Acne': {
    name: 'Acne',
    description: 'A common skin condition that occurs when hair follicles become plugged with oil and dead skin cells.',
    treatment: [
      'Topical treatments (benzoyl peroxide, salicylic acid)',
      'Oral medications (antibiotics, hormonal therapy)',
      'Lifestyle changes (proper skincare, diet)'
    ],
    prevention: [
      'Wash face twice daily',
      'Avoid touching face',
      'Use non-comedogenic products'
    ]
  },
  'Atopic Dermatitis': {
    name: 'Atopic Dermatitis',
    description: 'A chronic condition that makes skin red and itchy, often occurring in people with a family history of allergies.',
    treatment: [
      'Moisturizers and emollients',
      'Topical corticosteroids',
      'Antihistamines for itching'
    ],
    prevention: [
      'Regular moisturizing',
      'Avoid triggers (allergens, stress)',
      'Use gentle skin care products'
    ]
  },
  'Eczema': {
    name: 'Eczema',
    description: 'A condition that makes skin red and itchy, often appearing in patches.',
    treatment: [
      'Moisturizers',
      'Topical corticosteroids',
      'Antihistamines'
    ],
    prevention: [
      'Avoid irritants',
      'Keep skin moisturized',
      'Manage stress'
    ]
  },
  'Melanoma': {
    name: 'Melanoma',
    description: 'A serious form of skin cancer that develops in the cells that produce melanin.',
    treatment: [
      'Surgical removal',
      'Immunotherapy',
      'Targeted therapy'
    ],
    prevention: [
      'Use sunscreen',
      'Avoid tanning beds',
      'Regular skin checks'
    ]
  },
  'Psoriasis': {
    name: 'Psoriasis',
    description: 'A chronic autoimmune condition that causes rapid skin cell growth, leading to scaling and inflammation.',
    treatment: [
      'Topical treatments',
      'Light therapy',
      'Systemic medications'
    ],
    prevention: [
      'Manage stress',
      'Avoid triggers',
      'Maintain healthy lifestyle'
    ]
  }
}

export default function SkinDiseasePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<DiseaseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)

    try {
      // In a real app, you would send the image to your ML model here
      // For now, we'll simulate a response with a random disease
      const diseases = Object.keys(diseaseInfo)
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)]
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setResult(diseaseInfo[randomDisease])
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black mb-6">Skin Disease Detection</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Upload Image</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null)
                      setPreviewUrl(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-black">Drag and drop an image here, or click to select</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Select Image
                  </label>
                </div>
              )}
            </div>

            {selectedImage && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Analysis Results</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-black">Analyzing image...</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black">{result.name}</h3>
                  <p className="text-black mt-2">{result.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black">Treatment Options:</h4>
                  <ul className="mt-2 space-y-2">
                    {result.treatment.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-black">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-black">Prevention Tips:</h4>
                  <ul className="mt-2 space-y-2">
                    {result.prevention.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-black">
                        <Info className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-4 text-black">Upload an image to analyze</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 