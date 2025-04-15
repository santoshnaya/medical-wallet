'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import { Download } from 'lucide-react';

interface GenerateQRProps {
  data: {
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    allergies: string[];
    medications: string[];
    conditions: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };
}

export default function GenerateQR({ data }: GenerateQRProps) {
  const [qrId, setQrId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQR = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate a unique ID for the QR code
      const uniqueId = crypto.randomUUID();
      
      // Store data in Firestore
      await setDoc(doc(db, 'medicalRecords', uniqueId), {
        ...data,
        createdAt: new Date().toISOString(),
      });

      setQrId(uniqueId);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('Error generating QR:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrId) return;
    
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `medical-record-${qrId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGenerateQR}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? 'Generating...' : 'Save and Generate QR'}
      </button>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {qrId && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <QRCode
              id="qr-code"
              value={`${window.location.origin}/view-record/${qrId}`}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <button
            onClick={downloadQR}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Download className="h-4 w-4" />
            Download QR Code
          </button>
          <p className="text-sm text-gray-500">
            Share this QR code with healthcare providers to access your medical information
          </p>
        </div>
      )}
    </div>
  );
} 