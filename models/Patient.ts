import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  address: {
    type: String,
    required: [true, 'Please provide an address']
  },
  medicalHistory: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

async function downloadReport() {
  const email = localStorage.getItem('userEmail');
  const res = await fetch(`/api/report/download?email=${encodeURIComponent(email ?? '')}`);
  if (res.ok) {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    // handle error
  }
}

// Call the function when needed
// downloadReport();