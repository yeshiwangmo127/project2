'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  department: string;
  qualifications: string;
  availability: Array<{
    date: string;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
      isBooked: boolean;
    }>;
  }>;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export default function BookAppointment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    department: '',
    appointmentDate: '',
    doctorId: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const departments = [
    'Cardiology',
    'Dentistry',
    'Ophthalmology',
    'Pediatrics',
    'Anesthesiology'
  ];

  useEffect(() => {
    if (formData.department) {
      fetchDoctors();
    }
  }, [formData.department]);

  useEffect(() => {
    console.log('formData:', formData);
    console.log('Button disabled state:', {
      loading,
      isDisabled: loading
    });
  }, [formData, loading]);

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors for department:', formData.department);
      const res = await fetch(`/api/doctors?department=${formData.department}`);
      const data = await res.json();
      console.log('Fetched doctors:', data);
      setDoctors(data.filter((doc: any) => doc.available));
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to fetch doctors');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Change:', name, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('New form data:', newData);
      return newData;
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentPayload = {
        doctorId: formData.doctorId,
        date: formData.appointmentDate,
        time: "",
        department: formData.department,
        description: formData.description,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      };

      const appointmentRes = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentPayload),
      });

      if (!appointmentRes.ok) {
        let errorMsg = 'Failed to book appointment';
        try {
          const errorData = await appointmentRes.json();
          if (errorData && errorData.error) errorMsg = errorData.error;
        } catch {}
        throw new Error(errorMsg);
      }

      router.push('/appointments/success');
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#7ea6f7] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-blue-300 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-gray-700 mb-2">Department</label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {doctors.length === 0 && formData.department && (
              <div className="text-red-600 text-center mb-4">No available doctors in this department.</div>
            )}

            {doctors.length > 0 && (
              <div>
                <label htmlFor="doctorId" className="block text-gray-700 mb-2">Select Doctor</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  required
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialty} ({doctor.qualifications})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.doctorId && (
              <div>
                <label htmlFor="appointmentDate" className="block text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Please describe your symptoms or reason for visit"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 