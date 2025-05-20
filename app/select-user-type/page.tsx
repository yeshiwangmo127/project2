'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';

export default function SelectUserType() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showDoctorConfirm, setShowDoctorConfirm] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        const storedUserType = localStorage.getItem('currentUserType');
        
        if (!userData || !storedUserType) {
          router.push('/login');
          return;
        }
        
        const user = JSON.parse(userData);
        if (user.userType !== storedUserType) {
          setError('Authentication error: User type mismatch');
          router.push('/login');
          return;
        }
        
        setUserType(user.userType);
      } catch (err) {
        setError('Authentication error');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleSelection = (type: string) => {
    if (userType !== type) {
      setError(`You have registered as ${userType}. Please continue as ${userType}.`);
      return;
    }
    if (type === 'doctor') {
      setShowDoctorConfirm(true);
      return;
    }
    // For patient, proceed as before
    localStorage.setItem('currentUserType', type);
    router.push('/');
  };

  const handleDoctorConfirm = () => {
    localStorage.setItem('currentUserType', 'doctor');
    setShowDoctorConfirm(false);
    router.push('/');
  };
  const handleDoctorCancel = () => {
    setShowDoctorConfirm(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button
            onClick={() => setError('')}
            className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#7ea6f7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <BackButton />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Select User Type
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to use the system
        </p>
        {error && (
          <div className="mt-4 text-center text-red-600 font-semibold">{error}</div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <button
              onClick={() => handleSelection('doctor')}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue as Doctor
            </button>
            <button
              onClick={() => handleSelection('patient')}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue as Patient
            </button>
          </div>
          {showDoctorConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4 text-center">Confirm Doctor Selection</h3>
                <p className="mb-6 text-center">Are you sure you want to continue as <span className="font-semibold">Doctor</span>?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDoctorConfirm}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleDoctorCancel}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 