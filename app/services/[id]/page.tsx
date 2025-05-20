'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Department data
const departmentDetails = {
  cardiology: {
    title: 'Cardiology Department',
    image: '/images/cardiology.jpg',
    description: 'Our Cardiology Department provides comprehensive care for all types of heart conditions.',
    services: [
      'Heart Disease Diagnosis and Treatment',
      'Cardiac Rehabilitation',
      'ECG and Stress Testing',
      'Heart Surgery',
      'Preventive Cardiology'
    ],
    doctors: [
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'Senior Cardiologist',
        experience: '15+ years experience'
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Interventional Cardiologist',
        experience: '12+ years experience'
      }
    ]
  },
  dentistry: {
    title: 'Dentistry Department',
    image: '/images/dentist.jpg',
    description: 'Our Dental Department offers comprehensive dental care services for all ages.',
    services: [
      'Routine Dental Checkups',
      'Cosmetic Dentistry',
      'Orthodontics',
      'Oral Surgery',
      'Pediatric Dentistry'
    ],
    doctors: [
      {
        name: 'Dr. Emily White',
        specialization: 'General Dentist',
        experience: '10+ years experience'
      },
      {
        name: 'Dr. David Brown',
        specialization: 'Orthodontist',
        experience: '8+ years experience'
      }
    ]
  },
  ophthalmology: {
    title: 'Ophthalmology Department',
    image: '/images/opthalmology.jpg',
    description: 'Our Eye Care Department provides comprehensive treatment for all eye conditions.',
    services: [
      'Vision Testing',
      'Cataract Surgery',
      'Glaucoma Treatment',
      'Laser Eye Surgery',
      'Pediatric Eye Care'
    ],
    doctors: [
      {
        name: 'Dr. Lisa Park',
        specialization: 'Senior Ophthalmologist',
        experience: '20+ years experience'
      },
      {
        name: 'Dr. James Wilson',
        specialization: 'Eye Surgeon',
        experience: '15+ years experience'
      }
    ]
  },
  pediatrics: {
    title: 'Pediatrics Department',
    image: '/images/paediatrics.jpg',
    description: 'Our Pediatrics Department provides specialized healthcare for infants, children, and adolescents.',
    services: [
      'Well-Child Visits',
      'Vaccinations',
      'Developmental Screening',
      'Acute Care',
      'Chronic Disease Management'
    ],
    doctors: [
      {
        name: 'Dr. Maria Rodriguez',
        specialization: 'Senior Pediatrician',
        experience: '18+ years experience'
      },
      {
        name: 'Dr. John Smith',
        specialization: 'Pediatric Specialist',
        experience: '12+ years experience'
      }
    ]
  },
  anesthesiology: {
    title: 'Anesthesiology Department',
    image: '/images/anesthesiology.jpg',
    description: 'Our Anesthesiology Department ensures safe and effective anesthesia care for all surgical procedures.',
    services: [
      'General Anesthesia',
      'Regional Anesthesia',
      'Pain Management',
      'Pre-operative Assessment',
      'Post-operative Care'
    ],
    doctors: [
      {
        name: 'Dr. Robert Lee',
        specialization: 'Chief Anesthesiologist',
        experience: '20+ years experience'
      },
      {
        name: 'Dr. Amanda Taylor',
        specialization: 'Pain Management Specialist',
        experience: '15+ years experience'
      }
    ]
  }
};

export default function DepartmentPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const department = departmentDetails[id as keyof typeof departmentDetails];

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Department not found</h1>
          <Link href="/services" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/services" className="text-blue-600 hover:underline">
            ← Back to Services
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64 sm:h-80">
            <Image
              src={department.image}
              alt={department.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{department.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{department.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Services</h2>
                <ul className="space-y-3">
                  {department.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                      <span className="ml-3 text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Specialists</h2>
                <div className="space-y-6">
                  {department.doctors.map((doctor, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-gray-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{doctor.experience}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/appointments"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 