'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Hospital, ShoppingBag, Search, Filter, Navigation } from 'lucide-react'

interface Place {
  id: string
  name: string
  address: string
  type: 'hospital' | 'pharmacy'
  distance: string
  rating?: number
  openNow?: boolean
}

export default function NearbyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'hospital' | 'pharmacy'>('all')

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          // In a real app, you would call Google Places API here
          // For now, we'll use mock data
          setPlaces([
            {
              id: '1',
              name: 'AMRI Hospitals',
              address: 'Plot No. 1, Jaydev Vihar, Bhubaneswar',
              type: 'hospital',
              distance: '2.5 km',
              rating: 4.7,
              openNow: true
            },
            {
              id: '2',
              name: 'Kalinga Hospital',
              address: 'Nayapalli, Bhubaneswar',
              type: 'hospital',
              distance: '3.1 km',
              rating: 4.5,
              openNow: true
            },
            {
              id: '3',
              name: 'Apollo Hospitals',
              address: 'Plot No. 251, Old National Highway 5, Bhubaneswar',
              type: 'hospital',
              distance: '4.2 km',
              rating: 4.6,
              openNow: true
            },
            {
              id: '4',
              name: 'Sparsh Hospital',
              address: 'Patia, Bhubaneswar',
              type: 'hospital',
              distance: '5.0 km',
              rating: 4.4,
              openNow: true
            },
            {
              id: '5',
              name: 'Medica Superspecialty Hospital',
              address: 'Chandrasekharpur, Bhubaneswar',
              type: 'hospital',
              distance: '3.8 km',
              rating: 4.3,
              openNow: true
            },
            {
              id: '6',
              name: 'MedPlus Pharmacy',
              address: 'Unit-4, Bhubaneswar',
              type: 'pharmacy',
              distance: '1.2 km',
              rating: 4.2,
              openNow: true
            },
            {
              id: '7',
              name: 'Apollo Pharmacy',
              address: 'Nayapalli, Bhubaneswar',
              type: 'pharmacy',
              distance: '2.8 km',
              rating: 4.4,
              openNow: true
            },
            {
              id: '8',
              name: 'Medlife Pharmacy',
              address: 'Patia, Bhubaneswar',
              type: 'pharmacy',
              distance: '3.5 km',
              rating: 4.1,
              openNow: true
            },
            {
              id: '9',
              name: 'Sum Hospital',
              address: 'Kalinga Nagar, Bhubaneswar',
              type: 'hospital',
              distance: '6.2 km',
              rating: 4.5,
              openNow: true
            },
            {
              id: '10',
              name: 'Care Hospital',
              address: 'Chandrasekharpur, Bhubaneswar',
              type: 'hospital',
              distance: '4.0 km',
              rating: 4.3,
              openNow: true
            }
          ])
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLoading(false)
        }
      )
    }
  }, [])

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || place.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Medical Facilities Near You</h1>
        
        {/* Location Information */}
        {userLocation && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-black">Your Current Location</h2>
                <p className="text-black">Latitude: {userLocation.lat.toFixed(6)}</p>
                <p className="text-black">Longitude: {userLocation.lng.toFixed(6)}</p>
                <p className="text-black mt-2">Bhubaneswar, Odisha, India</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals or pharmacies..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg ${
                selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('hospital')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedType === 'hospital' ? 'bg-blue-600 text-white' : 'bg-white text-black'
              }`}
            >
              <Hospital className="h-5 w-5" />
              Hospitals
            </button>
            <button
              onClick={() => setSelectedType('pharmacy')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedType === 'pharmacy' ? 'bg-blue-600 text-white' : 'bg-white text-black'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              Pharmacies
            </button>
          </div>
        </div>

        {/* Places List */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-xl font-semibold mb-4 text-black">Nearby Places</h2>
          {loading ? (
            <p className="text-black">Loading places...</p>
          ) : filteredPlaces.length === 0 ? (
            <p className="text-black">No places found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlaces.map((place) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-black">{place.name}</h3>
                      <p className="text-sm text-black">{place.address}</p>
                      <p className="text-sm text-black mt-1">{place.distance} away</p>
                    </div>
                    {place.type === 'hospital' ? (
                      <Hospital className="h-6 w-6 text-blue-600" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  {place.rating && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-black">{place.rating}</span>
                      {place.openNow && (
                        <span className="text-sm text-green-600 ml-2">Open Now</span>
                      )}
                    </div>
                  )}
                  <button className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
} 