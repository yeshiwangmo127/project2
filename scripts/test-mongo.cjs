require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yeshimongo:BEdNTDKn37jqu3fb@cluster0.lqudxj5.mongodb.net/hospital_management?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

testConnection(); 