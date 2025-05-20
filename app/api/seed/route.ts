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
  specialty: string;
  department: string;
  qualifications: string;
}

const doctors: DoctorInput[] = [
  {
    name: 'John Smith',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    qualifications: 'MD, FACC'
  },
  {
    name: 'Sarah Johnson',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    qualifications: 'MD, FAAP'
  },
  {
    name: 'Michael Chen',
    specialty: 'Ophthalmologist',
    department: 'Ophthalmology',
    qualifications: 'MD, FACS'
  },
  {
    name: 'Emily Brown',
    specialty: 'Dentist',
    department: 'Dentistry',
    qualifications: 'DDS, MS'
  },
  {
    name: 'David Wilson',
    specialty: 'Anesthesiologist',
    department: 'Anesthesiology',
    qualifications: 'MD, FASA'
  },
  {
    name: 'Lisa Anderson',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    qualifications: 'MD, PhD'
  },
  {
    name: 'Robert Taylor',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    qualifications: 'MD, MPH'
  },
  {
    name: 'Maria Garcia',
    specialty: 'Ophthalmologist',
    department: 'Ophthalmology',
    qualifications: 'MD, FACS'
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