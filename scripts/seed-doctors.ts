import { MongoClient } from 'mongodb';

const sampleDoctors = [
  {
    name: "Dr. John Smith",
    department: "Cardiology",
    qualification: "MD, FACC",
    experience: 15,
    specialization: "Interventional Cardiology",
    imageUrl: "https://example.com/doctor1.jpg"
  },
  {
    name: "Dr. Sarah Johnson",
    department: "Cardiology",
    qualification: "MD, PhD",
    experience: 12,
    specialization: "Electrophysiology",
    imageUrl: "https://example.com/doctor2.jpg"
  },
  {
    name: "Dr. Michael Chen",
    department: "Pediatrics",
    qualification: "MD, FAAP",
    experience: 10,
    specialization: "Pediatric Emergency Medicine",
    imageUrl: "https://example.com/doctor3.jpg"
  },
  {
    name: "Dr. Emily Brown",
    department: "Ophthalmology",
    qualification: "MD, FACS",
    experience: 8,
    specialization: "Retinal Surgery",
    imageUrl: "https://example.com/doctor4.jpg"
  }
];

async function seedDoctors() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Clear existing doctors
    await db.collection('doctors').deleteMany({});

    // Insert sample doctors
    const result = await db.collection('doctors').insertMany(sampleDoctors);
    
    console.log(`Successfully inserted ${result.insertedCount} doctors`);
    
    await client.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDoctors(); 