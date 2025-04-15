'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Home, FileText, Users, Activity, Brain, Heart } from 'lucide-react'
import { HeartIcon } from '@heroicons/react/24/outline'
import BloodPressurePrediction from './BloodPressurePrediction'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showBloodPressurePrediction, setShowBloodPressurePrediction] = useState(false)

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleSidebar = () => setIsOpen(!isOpen)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Heart Prediction', href: '/heart-prediction', icon: Heart },
    { name: 'Lung Prediction', href: '/lung-prediction', icon: Activity },
    { name: 'Anemia Prediction', href: '/anemia-prediction', icon: Activity },
  ]

  return (
    <div className={`${isOpen ? 'relative z-50' : ''}`}>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl transform transition-all duration-300 ease-out z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 mt-16 min-h-[calc(100vh-4rem)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Medical Wallet</h2>
            <p className="text-blue-100 text-sm">Your health companion</p>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                onClick={toggleSidebar}
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <button 
              onClick={() => setShowBloodPressurePrediction(true)}
              className="flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
            >
              <HeartIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Blood Pressure Prediction</span>
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white text-sm text-center">
                Need help? Contact support
              </p>
            </div>
          </div>
        </div>
      </aside>

      {showBloodPressurePrediction && (
        <BloodPressurePrediction onClose={() => setShowBloodPressurePrediction(false)} />
      )}
    </div>
  )
}

export default Sidebar 