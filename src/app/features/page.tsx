'use client';

import { Shield, QrCode, AlertTriangle, Lock, FileText, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    id: 'secure',
    icon: Shield,
    title: 'Secure Storage',
    description: 'Your medical records are encrypted and stored securely in the cloud, accessible only to you and authorized healthcare providers.',
  },
  {
    id: 'qr',
    icon: QrCode,
    title: 'QR Code Access',
    description: 'Generate QR codes for quick access to your medical records in emergencies or during doctor visits.',
  },
  {
    id: 'emergency',
    icon: AlertTriangle,
    title: 'Emergency Access',
    description: 'Grant temporary access to your medical records in emergency situations with just a few taps.',
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Privacy Control',
    description: 'Full control over who can access your medical information and for how long.',
  },
  {
    id: 'records',
    icon: FileText,
    title: 'Comprehensive Records',
    description: 'Store and manage all your medical documents, test results, and prescriptions in one place.',
  },
  {
    id: 'history',
    icon: Clock,
    title: 'Medical History',
    description: 'Maintain a complete history of your medical conditions, treatments, and medications.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Medical Wallet makes managing your medical records simple, secure, and accessible.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{feature.title}</h2>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 