import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  description: { 
    type: String 
  },
  patient: {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    dateOfBirth: { 
      type: String, 
      required: true 
    }
  }
}, {
  timestamps: true
});

// Prevent model overwrite error
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

export default Appointment; 