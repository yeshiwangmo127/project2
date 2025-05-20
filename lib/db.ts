import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB Connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Define Report Schema
const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Report Model (only if it doesn't exist)
const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export async function createReport({
  title,
  description,
  fileUrl,
  patientId,
  doctorId,
}: {
  title: string;
  description: string;
  fileUrl: string;
  patientId: string;
  doctorId: string;
}) {
  await connectDB();
  const report = new Report({
    title,
    description,
    fileUrl,
    patientId,
    doctorId
  });
  return report.save();
}

export async function getPatientReports(patientId: string) {
  await connectDB();
  return Report.find({ patientId })
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 })
    .exec();
}

export async function getDoctorReports(doctorId: string) {
  await connectDB();
  return Report.find({ doctorId })
    .populate('patientId', 'name')
    .sort({ createdAt: -1 })
    .exec();
} 