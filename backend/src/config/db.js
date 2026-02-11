const mongoose = require('mongoose');

async function connectDb() {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management';

  console.log('Connecting to MongoDB...');

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log('MongoDB connected');
}

module.exports = connectDb;


