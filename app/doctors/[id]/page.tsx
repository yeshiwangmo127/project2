'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Availability {
  date: string;
  timeSlots: TimeSlot[];
}

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  department: string;
  qualifications: string;
  availability: Availability[];
}

interface CalendarTileProps {
  date: Date;
  view: string;
}

export default function DoctorProfile() {
  const params = useParams();
  const id = params?.id as string;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
    fetchDoctor();
    }
  }, [id]);

  useEffect(() => {
    if (doctor) {
      const dateAvailability = doctor.availability.find(
        (a: Availability) => new Date(a.date).toDateString() === selectedDate.toDateString()
      );
      setAvailableSlots(dateAvailability?.timeSlots || []);
    }
  }, [selectedDate, doctor]);

  const fetchDoctor = async () => {
    try {
      const res = await fetch(`/api/doctors/${id}`);
      const data = await res.json();
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTileClassName = ({ date }: CalendarTileProps) => {
    if (!doctor) return '';

    const hasAvailability = doctor.availability.some(
      (a: Availability) => 
        new Date(a.date).toDateString() === date.toDateString() &&
        a.timeSlots.some((slot: TimeSlot) => !slot.isBooked)
    );
    return hasAvailability ? 'bg-green-100' : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Doctor not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Dr. {doctor.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-600 font-medium">Specialty:</label>
                      <p className="text-gray-800">{doctor.specialty}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Department:</label>
                      <p className="text-gray-800">{doctor.department}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Qualifications:</label>
                      <p className="text-gray-800">{doctor.qualifications}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link 
                      href={`/appointments?doctor=${doctor._id}`}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Availability Calendar</h2>
                  <Calendar
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value);
                      }
                    }}
                    value={selectedDate}
                    className="w-full border rounded-lg"
                    tileClassName={getTileClassName}
                    minDate={new Date()}
                  />

                  {availableSlots.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        Available Slots for {selectedDate.toLocaleDateString()}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-center ${
                              slot.isBooked
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 