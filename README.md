# Medical Wallet Application

A comprehensive medical records management system built with modern web technologies.

## Tech Stack

### Frontend Framework
- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript

### Styling and UI
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
- [Framer Motion](https://www.framer.com/motion/) - Animation library

### Authentication and Database
- [Supabase](https://supabase.com/) - Open source Firebase alternative
  - Database
  - Authentication
  - Storage
- [Firebase](https://firebase.google.com/) - Backend services (optional)

### AI and Machine Learning
- [Google Gemini AI](https://ai.google.dev/) - AI model for chatbot functionality
- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) - Gemini AI SDK

### File Handling and Documents
- [jsPDF](https://www.npmjs.com/package/jspdf) - PDF generation
- [QRCode](https://www.npmjs.com/package/qrcode.react) - QR code generation
- [@uploadcare/react-widget](https://www.npmjs.com/package/@uploadcare/react-widget) - File upload handling

### State Management and Data Fetching
- [React Query](https://tanstack.com/query/latest) - Data fetching and caching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

### UI Components and Styling
- [@radix-ui/react-dropdown-menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) - Accessible dropdown menus
- [@radix-ui/react-dialog](https://www.radix-ui.com/primitives/docs/components/dialog) - Modal dialogs
- [@radix-ui/react-popover](https://www.radix-ui.com/primitives/docs/components/popover) - Popover components
- [react-hot-toast](https://react-hot-toast.com/) - Toast notifications

## Features

- 🏥 Medical Records Management
- 💊 Medication Tracking
- 📅 Appointment Scheduling
- 🤖 AI-powered Medical Assistant
- 📱 Responsive Design
- 🔒 Secure Authentication
- 📄 PDF Report Generation
- 📸 Medical Image Upload
- 🗺️ Nearby Medical Facilities
- 📱 Mobile-Friendly Interface

## Environment Variables

```env

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

