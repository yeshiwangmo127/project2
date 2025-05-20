'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '../components/BackButton';

export default function CombinedLoginPage() {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      // Hardcoded admin credentials
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({ name: username, userType: 'admin' }));
        localStorage.setItem('currentUserType', 'admin');
        router.push('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store user data and userType
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('currentUserType', data.user.userType);
        
        // Redirect based on user type
        if (data.user.userType === 'doctor' || data.user.userType === 'patient') {
          router.push('/select-user-type');
        } else {
          router.push('/');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred during login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#7ea6f7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <BackButton />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {role === 'admin' ? 'Admin Login' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-6 flex justify-center">
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as 'user' | 'admin');
            setError('');
          }}
          className="p-2 border rounded-md"
        >
          <option value="user">User (Doctor/Patient)</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {role === 'admin' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {role === 'admin' ? 'Login as Admin' : 'Sign in'}
              </button>
            </div>
          </form>

          {role === 'user' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">New to Hospital Management System?</p>
              <Link
                href="/register"
                className="inline-block mt-2 text-green-600 hover:text-green-800 font-medium"
              >
                Create your account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
