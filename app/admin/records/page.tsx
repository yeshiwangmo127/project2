'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MedicalRecord {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  prescription: string;
  date: string;
  fileUrl?: string;
}

export default function AdminRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
      return;
    }

    fetchRecords();
  }, [router]);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/medical-records');
      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }
      const data = await response.json();
      setRecords(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading medical records');
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error downloading file');
    }
  };

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 sm:py-12" style={{ backgroundColor: "#7ea6f7" }}>
      <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4">
        <div className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 sm:gap-0">
            <h1 className="text-2xl sm:text-4xl font-bold">Medical Records</h1>
            <Link href="/admin" className="border-2 border-black rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition">
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-xs sm:text-base">
              {error}
            </div>
          )}

          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Search by patient, doctor, or department..."
              className="w-full px-2 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{record.patientName}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{record.doctorName}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{record.department}</td>
                    <td className="px-2 sm:px-6 py-4">{record.diagnosis}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{record.date}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                      <button
                        onClick={() => handleDownload(record.fileUrl!, `${record.patientName}_record.pdf`)}
                        className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3"
                        disabled={!record.fileUrl}
                      >
                        Download
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 