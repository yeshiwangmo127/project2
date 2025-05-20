'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  department: string;
  qualifications: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = [
    'All',
    'Cardiology',
    'Dentistry',
    'Ophthalmology',
    'Pediatrics',
    'Anesthesiology'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [selectedDepartment]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const url = selectedDepartment && selectedDepartment !== 'All'
        ? `/api/doctors?department=${selectedDepartment}`
        : '/api/doctors';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch doctors');
      }

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorImage = (name: string) => {
    // Convert name to lowercase and remove spaces for image naming
    const imageName = name.toLowerCase().replace(/\s+/g, '-');
    return `/images/doctors/${imageName}.jpg`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Our Doctors</h1>
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept === 'All' ? '' : dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading doctors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchDoctors}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No doctors found for the selected department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doctor => (
                <Link
                  key={doctor._id}
                  href={`/doctors/${doctor._id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48 w-full">
                      <Image
                        src={getDoctorImage(doctor.name)}
                        alt={`Dr. ${doctor.name}`}
                        fill
                        className="object-cover"
                        onError={(e: any) => {
                          e.target.src = '/images/doctors/default-doctor.jpg';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Dr. {doctor.name}
                      </h2>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Specialty:</span> {doctor.specialty}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Department:</span> {doctor.department}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Qualifications:</span> {doctor.qualifications}
                        </p>
                      </div>
                      <div className="mt-4">
                        <span className="text-blue-600 font-medium">View Profile →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 