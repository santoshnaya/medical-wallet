'use client';

import { Users, Target, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize the security and privacy of your medical data above all else.',
  },
  {
    icon: Heart,
    title: 'Patient-Centric',
    description: 'Our platform is designed with patients\' needs and convenience in mind.',
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We continuously innovate to provide the best digital health solutions.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work with healthcare providers to ensure seamless integration.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Medical Wallet</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering patients with secure, accessible, and comprehensive medical record management.
          </p>
        </div>

        <div className="mt-16">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Medical Wallet was founded in 2023 with a simple mission: to make medical records management
              secure, accessible, and user-friendly. We recognized the challenges patients face in managing
              their medical information and set out to create a solution that puts control back in their hands.
            </p>
            <p className="text-gray-600 mb-6">
              Our platform combines cutting-edge security technology with an intuitive interface, making it
              easy for patients to store, access, and share their medical records when needed. We work
              closely with healthcare providers to ensure seamless integration and compliance with medical
              data standards.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <value.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-gray-600 mb-6">
              Our team consists of healthcare professionals, security experts, and technology innovators
              who are passionate about improving healthcare through technology. We combine decades of
              experience in healthcare, security, and software development to create a platform that
              truly serves patients' needs.
            </p>
            <p className="text-gray-600">
              We're constantly working to improve our platform and add new features based on user
              feedback and the evolving needs of the healthcare industry. Our goal is to make Medical
              Wallet the most trusted and comprehensive medical records management solution available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 