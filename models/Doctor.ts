import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please specify the department'],
    enum: ['Cardiology', 'Dentistry', 'Ophthalmology', 'Pediatrics', 'Anesthesiology']
  },
  qualification: {
    type: String,
    required: [true, 'Please provide qualification']
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience']
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization']
  },
  imageUrl: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  availability: {
    type: [
      {
        date: String,
        timeSlots: [
          {
            startTime: String,
            endTime: String,
            isBooked: Boolean
          }
        ]
      }
    ],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema); 