import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Availability {
  date: Date;
  timeSlots: TimeSlot[];
}

interface DoctorInput {
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: number;
}

const doctors: DoctorInput[] = [
  {
    name: 'John Smith',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    qualification: 'MD, FACC',
    experience: 15
  },
  {
    name: 'Sarah Johnson',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    qualification: 'MD, FAAP',
    experience: 12
  },
  {
    name: 'Michael Chen',
    specialization: 'Ophthalmologist',
    department: 'Ophthalmology',
    qualification: 'MD, FACS',
    experience: 10
  },
  {
    name: 'Emily Brown',
    specialization: 'Dentist',
    department: 'Dentistry',
    qualification: 'DDS, MS',
    experience: 8
  },
  {
    name: 'David Wilson',
    specialization: 'Anesthesiologist',
    department: 'Anesthesiology',
    qualification: 'MD, FASA',
    experience: 14
  },
  {
    name: 'Lisa Anderson',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    qualification: 'MD, PhD',
    experience: 20
  },
  {
    name: 'Robert Taylor',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    qualification: 'MD, MPH',
    experience: 11
  },
  {
    name: 'Maria Garcia',
    specialization: 'Ophthalmologist',
    department: 'Ophthalmology',
    qualification: 'MD, FACS',
    experience: 9
  }
];

function generateAvailability() {
  const availability = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    availability.push({
      date,
      timeSlots: [
        { startTime: '09:00', endTime: '10:00', isBooked: false },
        { startTime: '10:00', endTime: '11:00', isBooked: false },
        { startTime: '11:00', endTime: '12:00', isBooked: false },
        { startTime: '14:00', endTime: '15:00', isBooked: false },
        { startTime: '15:00', endTime: '16:00', isBooked: false },
        { startTime: '16:00', endTime: '17:00', isBooked: false },
      ]
    });
  }
  
  return availability;
}

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing doctors
    await Doctor.deleteMany({});
    
    // Create doctors with availability
    for (const doctor of doctors) {
      const availability = generateAvailability();
      await Doctor.create({
        ...doctor,
        availability
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 