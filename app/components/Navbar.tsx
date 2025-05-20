'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth state on mount and when pathname changes
    checkAuthState();

    // Set up storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'currentUserType') {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom profile-updated event
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const updatedUser = customEvent.detail;
      setUserName(updatedUser.name || '');
      setProfilePic(updatedUser.profilePic || null);
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    // Close profile dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleProfileUpdate);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [pathname]); // Re-run when pathname changes

  const checkAuthState = () => {
    try {
      const user = localStorage.getItem('user');
      const storedUserType = localStorage.getItem('currentUserType');
      
      if (user && storedUserType) {
        const userData = JSON.parse(user);
        if (userData.userType === storedUserType) {
          setIsLoggedIn(true);
          setUserName(userData.name || '');
          setUserType(storedUserType);
          setProfilePic(userData.profilePic || null);
        } else {
          // Clear invalid state
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserType('');
        setProfilePic(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserName('');
      setUserType('');
      setProfilePic(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUserType');
    setIsLoggedIn(false);
    setUserName('');
    setUserType('');
    setProfilePic(null);
    router.push('/login');
  };

  // Don't show navbar on login, register, and user type selection pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/select-user-type') {
    return null;
  }

  return (
    <nav className="w-full bg-blue-600 text-white">
      <div className="flex items-center justify-between py-2 sm:py-4 pr-2 sm:pr-4 pl-4 sm:pl-[30px] gap-2 sm:gap-0">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:text-blue-200">
          <div className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white">
            <Image
              src="/images/hospitalLogo.png"
              alt="Hospital Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg sm:text-2xl font-bold">Pure Path Medical</span>
        </Link>
        {/* Hamburger button for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 ml-auto focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white mb-1 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        {/* Desktop menu */}
        <div className="hidden sm:flex flex-row items-center space-x-6 ml-auto">
          <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-blue-200 transition-colors">About</Link>
          <Link href="/services" className="hover:text-blue-200 transition-colors">Services</Link>
          {isLoggedIn && (
            <Link href="/appointments" className="hover:text-blue-200 transition-colors">Book Appointment</Link>
          )}
          {isLoggedIn && userType === 'admin' && (
            <Link href="/admin" className="hover:text-blue-200 transition-colors">Admin Dashboard</Link>
          )}
          {isLoggedIn && userType === 'doctor' && false && (
            <>
              <Link href="/upload-report" className="hover:text-blue-200 transition-colors">Upload Report</Link>
              <Link href="/doctors/dashboard" className="hover:text-blue-200 transition-colors">Doctor Dashboard</Link>
            </>
          )}
          {isLoggedIn && userType === 'patient' && false && (
            <Link href="/my-reports" className="hover:text-blue-200 transition-colors">My Reports</Link>
          )}
          {isLoggedIn ? (
            <div className="relative profile-menu ml-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold overflow-hidden">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default-profile.png';
                      }}
                    />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>
                <span>{userName}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    Signed in as<br/>
                    <span className="font-semibold">{userName}</span>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>

                  {userType === 'doctor' && (
                    <>
                      <Link
                        href="/upload-report"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Upload Report
                      </Link>
                    </>
                  )}

                  {userType === 'patient' && (
                    <Link
                      href="/my-reports"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View My Reports
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      {/* Mobile menu overlay and drawer */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Side drawer */}
          <div className="fixed top-0 right-0 z-50 w-2/5 max-w-[160px] bg-blue-700 bg-opacity-95 flex flex-col items-start mt-14 px-4 py-6 space-y-6 text-base shadow-2xl transition-transform duration-300 rounded-bl-2xl">
            <button
              className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
            <Link href="/" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/about" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/services" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            {isLoggedIn && (
              <Link href="/appointments" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>Book Appointment</Link>
            )}
            {isLoggedIn && userType === 'admin' && (
              <Link href="/admin" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
            )}
            {isLoggedIn && userType === 'doctor' && false && (
              <>
                <Link href="/upload-report" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>Upload Report</Link>
                <Link href="/doctors/dashboard" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>Doctor Dashboard</Link>
              </>
            )}
            {isLoggedIn && userType === 'patient' && (
              <Link href="/my-reports" className="hover:text-blue-200 transition-colors w-full" onClick={() => setMobileMenuOpen(false)}>My Reports</Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors w-full text-left"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors w-full text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </>
      )}
    </nav>
  );
} 