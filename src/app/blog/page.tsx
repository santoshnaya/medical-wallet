'use client';

import { Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Digital Health Records',
    excerpt: 'How digital health records are transforming patient care and healthcare management.',
    date: '2024-03-15',
    readTime: '5 min read',
    author: 'Dr. Sarah Johnson',
    category: 'Technology',
  },
  {
    id: 2,
    title: 'Understanding Your Medical History',
    excerpt: 'Why maintaining a complete medical history is crucial for your health and how to do it effectively.',
    date: '2024-03-10',
    readTime: '4 min read',
    author: 'Dr. Michael Chen',
    category: 'Health',
  },
  {
    id: 3,
    title: 'Privacy in Digital Healthcare',
    excerpt: 'Exploring the importance of privacy and security in managing digital health records.',
    date: '2024-03-05',
    readTime: '6 min read',
    author: 'Dr. Emily Parker',
    category: 'Security',
  },
  {
    id: 4,
    title: 'Emergency Preparedness with Digital Records',
    excerpt: 'How digital medical records can save lives in emergency situations.',
    date: '2024-02-28',
    readTime: '4 min read',
    author: 'Dr. James Wilson',
    category: 'Emergency Care',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest in medical technology, health tips, and industry insights.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
} 