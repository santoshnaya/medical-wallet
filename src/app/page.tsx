'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Clock, Lock, QrCode, Shield, Share2, FileText, CheckCircle2, ArrowRight, Users, User, Stethoscope, UserCog, MapPin } from 'lucide-react'
import Image from 'next/image'
import { 
  Brain,
  UserPlus,
  Trophy,
  Star,
  Calendar
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6 py-16">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-black">MedicalWallet</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login?role=user" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <User className="h-5 w-5" />
                Login as User
              </Link>
              <Link href="/login?role=doctor" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Stethoscope className="h-5 w-5" />
                Login as Doctor
              </Link>
              <Link href="/login?role=admin" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <UserCog className="h-5 w-5" />
                Login as Admin
              </Link>
              <Link href="/register" className="px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50">
                Register
              </Link>
            </div>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Your Partner in Health and Wellness
              </h1>
              <p className="text-lg text-black mb-8">
                Experience seamless healthcare management with our comprehensive medical record system.
              </p>
              <div className="flex gap-4">
                <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Get Started
                </Link>
                <Link href="/about" className="px-6 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/doctor-hero.jpg"
                alt="Medical professionals"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-black">Compassion</h3>
              <p className="text-black text-sm">Caring for every patient</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-black">Excellence</h3>
              <p className="text-black text-sm">Striving for the best</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-black">Integrity</h3>
              <p className="text-black text-sm">Honest and ethical care</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-black">Respect</h3>
              <p className="text-black text-sm">Valuing every person</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-black">Teamwork</h3>
              <p className="text-black text-sm">Working together</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="/about-team.jpg"
                alt="Medical team"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">About Us</h2>
              <p className="text-black mb-6">
                We are dedicated to providing the highest quality healthcare services while ensuring your medical information is secure and accessible when you need it.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-black">24/7 Patient Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-black">Expert Medical Team</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-black">Advanced Technology</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Departments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: '🫀', name: 'Cardiology' },
              { icon: '🧠', name: 'Neurology' },
              { icon: '🦷', name: 'Dental' },
              { icon: '👶', name: 'Pediatrics' },
              { icon: '🦴', name: 'Orthopedics' },
              { icon: '👁️', name: 'Ophthalmology' }
            ].map((dept, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-3">{dept.icon}</div>
                <h3 className="font-medium text-black">{dept.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { year: '2023', title: 'Best Hospital', desc: 'Healthcare Excellence' },
              { year: '2022', title: 'Innovation Award', desc: 'Digital Healthcare' },
              { year: '2021', title: 'Patient Care', desc: 'Service Excellence' },
              { year: '2020', title: 'Quality Award', desc: 'Medical Standards' }
            ].map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <Trophy className="h-8 w-8 text-blue-600 mb-4" />
                <div className="text-sm text-blue-600 mb-2">{award.year}</div>
                <h3 className="font-semibold mb-2 text-black">{award.title}</h3>
                <p className="text-black text-sm">{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Some Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Santosh', 
                role: 'Patient', 
                text: 'The medical team was incredibly professional and caring. They took the time to explain everything in detail and made me feel comfortable throughout my treatment. The follow-up care was exceptional!' 
              },
              { 
                name: 'Biswa', 
                role: 'Patient', 
                text: 'I was impressed by the state-of-the-art facilities and the efficiency of the staff. The doctors were knowledgeable and the nurses were very attentive. The digital health records system made everything so convenient.' 
              },
              { 
                name: 'Rinku', 
                role: 'Patient', 
                text: 'From the moment I walked in, I felt welcomed and cared for. The doctors were thorough in their diagnosis and the treatment plan was well-explained. The recovery process was smooth thanks to their excellent care.' 
              },
              { 
                name: 'Rohit', 
                role: 'Patient', 
                text: 'The hospital has a great atmosphere and the staff is very friendly. The doctors are experts in their fields and the support staff is always ready to help. I would definitely recommend this hospital to others.' 
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-black mb-4">{review.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-medium text-black">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Book an Appointment</h2>
              <p className="text-blue-100 mb-8">
                Schedule your visit with our expert medical team. We're here to help you stay healthy.
              </p>
              <Link href="/appointment" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50">
                <Calendar className="h-5 w-5" />
                Book Now
              </Link>
            </div>
            <div className="relative h-[300px]">
              <Image
                src="/appointment.jpg"
                alt="Book appointment"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
