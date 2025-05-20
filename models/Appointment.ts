import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true },
  time: { type: String, default: "" },
  department: { type: String, required: true },
  status: { type: String, default: 'scheduled' },
  createdAt: { type: Date, default: Date.now },
  description: { type: String },
  patient: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: String, required: true }
  }
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema); 