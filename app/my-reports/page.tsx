'use client';

import { useEffect, useState } from 'react';

interface Report {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  created_at: string;
  doctor_name: string;
  patient_name: string;
}

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setError('Please log in to view your reports');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        if (!user.id) {
          setError('User ID not found');
          setLoading(false);
          return;
        }

        const userId = user.id;
        const response = await fetch(`/api/reports?patientId=${encodeURIComponent(userId)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch reports');
        }

        const data = await response.json();
        setReports(data.reports);
      } catch (err: any) {
        setError(err.message || 'Error loading reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
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

  const handleDelete = async (reportId: string) => {
    setReportToDelete(reportId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    try {
      const response = await fetch(`/api/reports/${reportToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete));
      setShowDeleteConfirm(false);
      setReportToDelete(null);
    } catch (err) {
      setError('Error deleting report');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#7ea6f7]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Reports</h1>

        {loading ? (
          <div className="text-center py-4">Loading reports...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-4 bg-blue-100 rounded-lg">
            No reports found. Reports will appear here once your doctor uploads them.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-blue-300 shadow p-4 rounded-md">
                <h2 className="text-lg font-semibold">{report.title}</h2>
                <p className="mt-2">{report.description}</p>
                {/* Date formatting with fallback */}
                {(() => {
                  let dateString = 'Unknown Date';
                  if (report.created_at) {
                    const date = new Date(report.created_at);
                    if (!isNaN(date.getTime())) {
                      dateString = date.toLocaleString();
                    }
                  }
                  // Fallback: use MongoDB ObjectId timestamp if available
                  if (dateString === 'Unknown Date' && report.id) {
                    try {
                      // MongoDB ObjectId: first 4 bytes are timestamp
                      const timestamp = parseInt(report.id.substring(0, 8), 16) * 1000;
                      const fallbackDate = new Date(timestamp);
                      if (!isNaN(fallbackDate.getTime())) {
                        dateString = fallbackDate.toLocaleString();
                      }
                    } catch {}
                  }
                  return (
                    <p className="text-sm text-gray-600 mt-2">
                      Doctor: {report.doctor_name} | {dateString}
                    </p>
                  );
                })()}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDownload(report.file_url, report.file_name)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Report</h3>
              <p className="mb-6">Are you sure you want to delete this report? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setReportToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
