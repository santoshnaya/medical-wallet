'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, Loader2, X } from 'lucide-react'
import { createWorker } from 'tesseract.js'

interface PrescriptionData {
  medicines: {
    name: string
    dosage: string
    instructions: string
  }[]
  doctorName: string
  date: string
  patientName: string
}

export default function PrescriptionPage() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PrescriptionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const workerRef = useRef<Tesseract.Worker | null>(null)

  useEffect(() => {
    // Initialize Tesseract worker
    const initWorker = async () => {
      workerRef.current = await createWorker('eng')
    }
    initWorker()

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [])

  const preprocessImage = async (imageData: string) => {
    // Create a temporary image element
    const img = new Image()
    img.src = imageData
    await new Promise((resolve) => {
      img.onload = resolve
    })

    // Create canvas and get image data
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Draw image
    ctx.drawImage(img, 0, 0)

    // Apply basic image processing
    const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageDataObj.data

    // Convert to grayscale and increase contrast
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      const contrast = 1.5 // Increase contrast
      const adjusted = ((avg - 128) * contrast) + 128
      
      data[i] = adjusted // R
      data[i + 1] = adjusted // G
      data[i + 2] = adjusted // B
    }

    ctx.putImageData(imageDataObj, 0, 0)
    return canvas.toDataURL()
  }

  const extractText = async (imageData: string) => {
    if (!workerRef.current) return ''

    const { data: { text } } = await workerRef.current.recognize(imageData)
    return text
  }

  const parsePrescription = (text: string): PrescriptionData => {
    // Basic parsing logic - can be enhanced based on your needs
    const lines = text.split('\n').filter(line => line.trim())
    
    const medicines: PrescriptionData['medicines'] = []
    let doctorName = ''
    let date = ''
    let patientName = ''

    for (const line of lines) {
      // Extract doctor name (usually starts with "Dr.")
      if (line.toLowerCase().includes('dr.')) {
        doctorName = line.trim()
      }
      // Extract date (look for date patterns)
      else if (line.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
        date = line.trim()
      }
      // Extract patient name (usually after "Patient:" or "Name:")
      else if (line.toLowerCase().includes('patient:') || line.toLowerCase().includes('name:')) {
        patientName = line.split(':')[1]?.trim() || ''
      }
      // Extract medicines (look for common medicine patterns)
      else if (line.match(/[A-Z][a-z]+/)) {
        const parts = line.split(/\s+/)
        if (parts.length >= 2) {
          medicines.push({
            name: parts[0],
            dosage: parts[1],
            instructions: parts.slice(2).join(' ')
          })
        }
      }
    }

    return {
      medicines,
      doctorName,
      date,
      patientName
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        setImage(imageData)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!image || !workerRef.current) return

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Preprocess image
      setProgress(20)
      const processedImage = await preprocessImage(image)
      if (!processedImage) throw new Error('Failed to process image')

      // Extract text
      setProgress(50)
      const text = await extractText(processedImage)

      // Parse prescription
      setProgress(80)
      const parsedData = parsePrescription(text)

      setResult(parsedData)
    } catch (err) {
      setError("Failed to analyze prescription. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prescription Analysis</h1>
          <p className="mt-2 text-gray-600">
            Upload a photo of your prescription to extract medicine details
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!image ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">Click to upload prescription</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={image}
                  alt="Prescription"
                  className="w-full rounded-lg shadow-sm"
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {loading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Analyze Prescription
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Analysis Results
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium">{result.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{result.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Patient</p>
                      <p className="font-medium">{result.patientName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Medicines
                    </h3>
                    <div className="space-y-4">
                      {result.medicines.map((medicine, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg space-y-2"
                        >
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-gray-600">
                            Dosage: {medicine.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            Instructions: {medicine.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 