'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  recentAppointments: Array<{
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: string;
  }>;
}

interface Doctor {
  _id: string;
  name: string;
  department: string;
  specialization?: string;
  qualification?: string;
  available: boolean;
}

function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    department: '',
    qualification: '',
    experience: '',
    specialization: '',
    imageUrl: '',
    available: true
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox') {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          experience: Number(form.experience)
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add doctor');
      }
      setForm({ name: '', department: '', qualification: '', experience: '', specialization: '', imageUrl: '', available: true });
      fetchDoctors();
    } catch (err: any) {
      setError(err.message || 'Failed to add doctor');
    } finally {
      setAdding(false);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !current })
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchDoctors();
    } catch (err) {
      alert('Failed to update doctor availability');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Doctor Availability</h2>
      {/* Add Doctor Form */}
      <form onSubmit={handleAddDoctor} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleFormChange} required placeholder="Name" className="p-2 border rounded" />
        <select name="department" value={form.department} onChange={handleFormChange} required className="p-2 border rounded">
          <option value="">Select Department</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dentistry">Dentistry</option>
          <option value="Ophthalmology">Ophthalmology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Anesthesiology">Anesthesiology</option>
        </select>
        <input name="qualification" value={form.qualification} onChange={handleFormChange} required placeholder="Qualification" className="p-2 border rounded" />
        <input name="specialization" value={form.specialization} onChange={handleFormChange} required placeholder="Specialization" className="p-2 border rounded" />
        <input name="experience" value={form.experience} onChange={handleFormChange} required placeholder="Experience (years)" type="number" min="0" className="p-2 border rounded" />
        <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange} placeholder="Image URL (optional)" className="p-2 border rounded" />
        <label className="flex items-center col-span-1 md:col-span-2">
          <input type="checkbox" name="available" checked={form.available} onChange={handleFormChange} className="mr-2" />
          Available
        </label>
        <button type="submit" disabled={adding} className="col-span-1 md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {adding ? 'Adding...' : 'Add Doctor'}
        </button>
      </form>
      {loading ? (
        <p>Loading doctors...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="min-w-full table-auto border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Specialization</th>
              <th className="px-4 py-2 border">Available</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td className="px-4 py-2 border">{doc.name}</td>
                <td className="px-4 py-2 border">{doc.department}</td>
                <td className="px-4 py-2 border">{doc.specialization || doc.qualification}</td>
                <td className="px-4 py-2 border">{doc.available ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">
                  <button
                    className={`px-3 py-1 rounded ${doc.available ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    onClick={() => toggleAvailability(doc._id, doc.available)}
                  >
                    {doc.available ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    recentAppointments: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/login');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        
        // Fetch appointments
        const appointmentsResponse = await fetch('/api/appointments');
        const appointmentsData = await appointmentsResponse.json();

        // Calculate stats
        const totalUsers = usersData.length;
        const totalDoctors = usersData.filter((user: any) => user.role === 'doctor').length;
        const totalPatients = usersData.filter((user: any) => user.role === 'patient').length;
        const totalAppointments = appointmentsData.length;
        const recentAppointments = appointmentsData
          .slice(0, 5)
          .map((appointment: any) => ({
            id: appointment.id,
            patientName: appointment.patient?.name || '-',
            doctorName: appointment.doctor?.name || '-',
            date: appointment.date,
            status: appointment.status
          }));

        setStats({
          totalUsers,
          totalDoctors,
          totalPatients,
          totalAppointments,
          recentAppointments
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchStats();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchStats();
    };
    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [router]);

  const handleAppointmentAction = async (appointmentId: string, action: 'complete' | 'cancel') => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'complete' ? 'completed' : 'cancelled' 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} appointment`);
      }

      // Refresh the dashboard data
      router.refresh();
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      setError(`Failed to ${action} appointment`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: "#7ea6f7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white bg-opacity-80 rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">Total Doctors</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">Total Patients</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalPatients}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">Total Appointments</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.totalAppointments}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <i className="bi bi-people-fill text-4xl mb-3 text-blue-600"></i>
              <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
              <p className="text-center text-sm mb-4">View, add, or remove users from the system.</p>
              <Link href="/admin/users" className="border-2 border-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition">
                Manage Users
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
              <i className="bi bi-calendar-check-fill text-4xl mb-3 text-green-600"></i>
              <h2 className="text-xl font-semibold mb-2">Appointments</h2>
              <p className="text-center text-sm mb-4">Review and manage all appointments.</p>
              <Link href="/admin/appointments" className="border-2 border-black rounded-lg px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition">
                Manage Appointments
              </Link>
            </div>
          </div>

          <AdminDoctors />

          <div className="flex justify-center mt-8">
            <Link href="/" className="border-2 border-black rounded-lg px-6 py-2 text-base font-medium hover:bg-black hover:text-white transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}