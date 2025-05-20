'use client';

import Link from 'next/link';
import Image from 'next/image';

const departments = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    description: 'Comprehensive heart care services including diagnosis, treatment, and prevention of heart diseases.',
    image: '/images/cardiology.jpg'
  },
  {
    id: 'dentistry',
    title: 'Dentistry',
    description: 'Complete dental care services including routine checkups, cosmetic procedures, and oral surgery.',
    image: '/images/dentist.jpg'
  },
  {
    id: 'ophthalmology',
    title: 'Ophthalmology',
    description: 'Expert eye care services including vision tests, surgery, and treatment of eye diseases.',
    image: '/images/opthalmology.jpg'
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics',
    description: 'Specialized healthcare for children including preventive care, vaccinations, and treatment.',
    image: '/images/paediatrics.jpg'
  },
  {
    id: 'anesthesiology',
    title: 'Anesthesiology',
    description: 'Professional anesthesia services for all types of surgical procedures.',
    image: '/images/anesthesiology.jpg'
  }
  ,

  {
    id: 'dermatology',
    title: 'Dermatology',
    description: 'Comprehensive skin care services including treatment of skin conditions and cosmetic procedures.',
    image: '/images/dermatology.png'
  }

];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#7ea6f7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Specialized Departments Section */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Specialized Departments
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Expert care from our specialized medical departments
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <div key={department.id} className="bg-blue-300 rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={department.image}
                  alt={department.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{department.title}</h3>
                <p className="text-gray-600 mb-4">{department.description}</p>
                <Link 
                  href={`/services/${department.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* General Services Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              General Services
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive healthcare services to meet all your medical needs
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Emergency Care */}
            <div className="bg-blue-300 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Care</h3>
                <p className="text-gray-600">
                  24/7 emergency medical services with quick response times and expert care for critical situations.
                </p>
              </div>
            </div>

            {/* Primary Care */}
            <div className="bg-blue-300 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Care</h3>
                <p className="text-gray-600">
                  Comprehensive primary healthcare services for individuals and families of all ages.
                </p>
              </div>
            </div>

            {/* Laboratory Services */}
            <div className="bg-blue-300 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Laboratory Services</h3>
                <p className="text-gray-600">
                  State-of-the-art diagnostic testing and laboratory services for accurate results.
                </p>
              </div>
            </div>

            {/* Pharmacy */}
            <div className="bg-blue-300 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pharmacy</h3>
                <p className="text-gray-600">
                  Full-service pharmacy with prescription medications and expert pharmacist consultation.
                </p>
              </div>
            </div>

            {/* Rehabilitation */}
            <div className="bg-blue-300 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Rehabilitation</h3>
                <p className="text-gray-600">
                  Comprehensive rehabilitation services including physical therapy and occupational therapy.
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-red-600 mb-4">Emergency Contact</h3>
                <p className="text-gray-600 mb-4">
                  Available 24/7 for medical emergencies. Quick response guaranteed.<br></br>
                  Contact us at: 01144332211
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 